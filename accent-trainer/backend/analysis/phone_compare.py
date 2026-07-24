"""Expected-vs-produced phone alignment and taxonomy matching.

Given the g2p expected ARPAbet sequence and the aligner's produced phone
sequence (both with timing), we:

1. Align the two sequences with a Levenshtein / edit alignment so each expected
   phone maps to a produced phone, an insertion, or a deletion.
2. For every substitution or distortion, build a PhoneObservation and run it
   past the taxonomy detectors.
3. Emit PhonemeError records for fired rules.

panphon feature distance is used both as a tie-breaker in alignment and as the
`feature_distance` signal some detectors read. When panphon is not installed we
fall back to a coarse equality/first-symbol heuristic so the module still runs.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.schemas import PhonemeError
from phonetics import error_profile as ep
from phonetics.error_profile import PhoneObservation

try:
    import panphon  # type: ignore
    import panphon.distance  # type: ignore
    _DIST = panphon.distance.Distance()
except Exception:  # pragma: no cover - optional dep
    _DIST = None


# Minimal ARPAbet -> IPA map for messaging. Stress digits are stripped first.
ARPA_TO_IPA = {
    "AA": "ɑ", "AE": "æ", "AH": "ə", "AO": "ɔ", "AW": "aʊ", "AY": "aɪ",
    "B": "b", "CH": "tʃ", "D": "d", "DH": "ð", "EH": "ɛ", "ER": "ɚ",
    "EY": "eɪ", "F": "f", "G": "ɡ", "HH": "h", "IH": "ɪ", "IY": "i",
    "JH": "dʒ", "K": "k", "L": "l", "M": "m", "N": "n", "NG": "ŋ",
    "OW": "oʊ", "OY": "ɔɪ", "P": "p", "R": "ɹ", "S": "s", "SH": "ʃ",
    "T": "t", "TH": "θ", "UH": "ʊ", "UW": "u", "V": "v", "W": "w",
    "Y": "j", "Z": "z", "ZH": "ʒ",
}


def strip_stress(arpa: str) -> str:
    return "".join(c for c in arpa if not c.isdigit())


def to_ipa(arpa: str) -> str:
    return ARPA_TO_IPA.get(strip_stress(arpa), strip_stress(arpa).lower())


@dataclass
class ExpectedPhone:
    arpabet: str  # with stress digit
    word: str
    position_in_word: int
    is_word_initial: bool
    is_word_final: bool
    is_coda: bool


@dataclass
class ProducedPhone:
    arpabet: str
    start_ms: int
    end_ms: int
    confidence: float
    probe: dict  # acoustic probe from parselmouth for this segment


def _feature_distance(a: str, b: str) -> float:
    a_ipa, b_ipa = to_ipa(a), to_ipa(b)
    if a_ipa == b_ipa:
        return 0.0
    if _DIST is not None:
        try:
            return float(_DIST.feature_edit_distance(a_ipa, b_ipa))
        except Exception:
            pass
    # coarse fallback: same first symbol -> near, else far
    return 0.5 if a_ipa[:1] == b_ipa[:1] else 1.0


def align_sequences(
    expected: list[ExpectedPhone], produced: list[ProducedPhone]
) -> list[tuple[ExpectedPhone | None, ProducedPhone | None]]:
    """Needleman-Wunsch style alignment weighted by panphon feature distance.

    Returns a list of (expected|None, produced|None) pairs. None on one side is
    an insertion/deletion.
    """
    n, m = len(expected), len(produced)
    gap = 1.0
    # cost matrix
    cost = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        cost[i][0] = i * gap
    for j in range(1, m + 1):
        cost[0][j] = j * gap
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            sub = cost[i - 1][j - 1] + _feature_distance(
                expected[i - 1].arpabet, produced[j - 1].arpabet
            )
            dele = cost[i - 1][j] + gap
            ins = cost[i][j - 1] + gap
            cost[i][j] = min(sub, dele, ins)

    # backtrace
    pairs: list[tuple[ExpectedPhone | None, ProducedPhone | None]] = []
    i, j = n, m
    while i > 0 or j > 0:
        if i > 0 and j > 0 and cost[i][j] == cost[i - 1][j - 1] + _feature_distance(
            expected[i - 1].arpabet, produced[j - 1].arpabet
        ):
            pairs.append((expected[i - 1], produced[j - 1]))
            i, j = i - 1, j - 1
        elif i > 0 and cost[i][j] == cost[i - 1][j] + gap:
            pairs.append((expected[i - 1], None))
            i -= 1
        else:
            pairs.append((None, produced[j - 1]))
            j -= 1
    pairs.reverse()
    return pairs


def build_observation(
    exp: ExpectedPhone, prod: ProducedPhone | None
) -> PhoneObservation:
    probe = prod.probe if prod else {}
    exp_bare = strip_stress(exp.arpabet)
    prod_bare = strip_stress(prod.arpabet) if prod else ""
    return PhoneObservation(
        expected_arpabet=exp_bare,
        produced_arpabet=prod_bare,
        expected_ipa=to_ipa(exp.arpabet),
        produced_ipa=to_ipa(prod.arpabet) if prod else "∅",
        word=exp.word,
        position_in_word=exp.position_in_word,
        start_ms=prod.start_ms if prod else 0,
        end_ms=prod.end_ms if prod else 0,
        duration_ms=probe.get("duration_ms"),
        vot_ms=probe.get("vot_ms"),
        closure_ms=probe.get("closure_ms"),
        burst_present=probe.get("burst_present"),
        f1=probe.get("f1"),
        f2=probe.get("f2"),
        f3=probe.get("f3"),
        f1_trajectory=probe.get("f1_trajectory"),
        f2_trajectory=probe.get("f2_trajectory"),
        spectral_centroid=probe.get("spectral_centroid"),
        mean_intensity=probe.get("mean_intensity"),
        voicing_ratio=probe.get("voicing_ratio"),
        feature_distance=_feature_distance(exp.arpabet, prod.arpabet) if prod else 1.0,
        is_word_initial=exp.is_word_initial,
        is_word_final=exp.is_word_final,
        is_coda=exp.is_coda,
    )


def compare(
    expected: list[ExpectedPhone], produced: list[ProducedPhone]
) -> list[PhonemeError]:
    """Run the full compare and return fired PhonemeError records."""
    pairs = align_sequences(expected, produced)
    errors: list[PhonemeError] = []
    for exp, prod in pairs:
        if exp is None:
            continue  # pure insertion, handled by epenthesis rules via produced
        obs = build_observation(exp, prod)
        exp_bare = strip_stress(exp.arpabet)
        for rule in ep.phone_rules_for_expected(exp_bare):
            fired = False
            if rule.detect is not None:
                try:
                    fired = bool(rule.detect(obs))
                except Exception:
                    fired = False
            elif prod is not None and obs.produced_arpabet in rule.confused_with:
                fired = True
            if fired:
                errors.append(_to_error(rule, obs))
                break  # one rule per expected phone
    return errors


def _to_error(rule: ep.PhoneRule, obs: PhoneObservation) -> PhonemeError:
    evidence: dict = {}
    if obs.vot_ms is not None:
        evidence["vot_ms"] = round(obs.vot_ms, 1)
        evidence["expected_vot_ms"] = 65
    if obs.f1 is not None:
        evidence["f1"] = round(obs.f1, 1)
    if obs.f2 is not None:
        evidence["f2"] = round(obs.f2, 1)
    if obs.f3 is not None:
        evidence["f3"] = round(obs.f3, 1)
    if obs.duration_ms is not None:
        evidence["duration_ms"] = round(obs.duration_ms, 1)
    if obs.feature_distance is not None:
        evidence["feature_distance"] = round(obs.feature_distance, 3)
    return PhonemeError(
        rule_id=rule.id,
        word=obs.word,
        position_in_word=obs.position_in_word,
        expected_ipa=rule.target_ipa,
        produced_ipa=obs.produced_ipa,
        start_ms=obs.start_ms,
        end_ms=obs.end_ms,
        severity=rule.severity,
        explanation=rule.explanation,
        articulation_cue=rule.articulation_cue,
        minimal_pairs=list(rule.minimal_pairs),
        mouth_diagram=rule.mouth_diagram,
        acoustic_evidence=evidence,
    )
