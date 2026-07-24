"""Error taxonomy for General American pronunciation and prosody training.

This module is the diagnostic knowledge base. It is deliberately data-first:
every error is a structured rule with the acoustic/alignment signal that fires
it, the physical correction cue, and the metadata the report layer needs to
render a specific, actionable message. Never emit a bare percentage. Every rule
here names an exact sound or syllable and says what the body should do instead.

Two rule families:

- PhoneRule: consonant and vowel errors detected from forced alignment plus
  per-phone acoustic probes.
- ProsodyRule: utterance-level rhythm, pitch, and connected-speech errors
  detected from prosody metrics.

Detection is intentionally split from the taxonomy. This file owns *what* is
wrong and *how to fix it*. The `detect` callables own the numeric thresholds so
they can be tuned in isolation (see the validation requirements in the spec:
false positives are worse than misses).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Callable, Optional


class Category(str, Enum):
    CONSONANT = "consonant"
    VOWEL = "vowel"
    PROSODY = "prosody"


@dataclass(frozen=True)
class PhoneRule:
    """A consonant or vowel substitution/distortion rule.

    `detect` receives a `PhoneObservation` (expected vs produced phone plus the
    acoustic probe for that segment) and returns True when the error is present.
    It is optional: some rules fire purely on the alignment mismatch and only
    use acoustics to gather `acoustic_evidence` for the report.
    """

    id: str
    category: Category
    target_ipa: str
    target_arpabet: str
    common_error_ipa: str
    severity: int  # 1-5 baseline; runtime may bump on frequency
    intelligibility_weight: float  # 0-1, how much this hurts being understood
    explanation: str
    articulation_cue: str
    mouth_diagram: str  # key into the frontend mouth-diagram library
    minimal_pairs: list[str] = field(default_factory=list)
    # Fires on a specific expected->produced ARPAbet confusion.
    expected_arpabet: tuple[str, ...] = ()
    confused_with: tuple[str, ...] = ()
    detect: Optional[Callable[["PhoneObservation"], bool]] = None


@dataclass(frozen=True)
class ProsodyRule:
    id: str
    category: Category
    metric: str
    unit: str
    severity: int
    intelligibility_weight: float
    explanation: str
    drill_suggestion: str
    # Returns (fired, measured_value) given the prosody metric bundle.
    detect: Callable[["ProsodyMetrics"], tuple[bool, float]]
    target_range: tuple[float, float] = (0.0, 0.0)


# --------------------------------------------------------------------------- #
# Lightweight observation containers the detectors read from.
# The analysis pipeline populates these; the taxonomy only consumes them.
# --------------------------------------------------------------------------- #


@dataclass
class PhoneObservation:
    expected_arpabet: str
    produced_arpabet: str
    expected_ipa: str
    produced_ipa: str
    word: str
    position_in_word: int
    start_ms: int
    end_ms: int
    # acoustic probe (any may be None if not measured for this phone type)
    duration_ms: Optional[float] = None
    vot_ms: Optional[float] = None
    closure_ms: Optional[float] = None
    burst_present: Optional[bool] = None
    f1: Optional[float] = None
    f2: Optional[float] = None
    f3: Optional[float] = None
    f1_trajectory: Optional[list[float]] = None
    f2_trajectory: Optional[list[float]] = None
    spectral_centroid: Optional[float] = None
    mean_intensity: Optional[float] = None
    voicing_ratio: Optional[float] = None  # fraction of frames voiced
    feature_distance: Optional[float] = None  # panphon distance expected/produced
    is_word_initial: bool = False
    is_word_final: bool = False
    is_coda: bool = False
    prev_is_vowel: bool = False
    next_is_vowel: bool = False


@dataclass
class ProsodyMetrics:
    npvi: float
    f0_range_st: float
    speech_rate_syll_s: float
    filler_per_100w: float
    content_function_intensity_ratio: float
    nuclear_on_focus: bool
    max_interword_gap_ms: float
    terminal_rising: bool
    word_stress_mismatches: int


# --------------------------------------------------------------------------- #
# Detection helpers. Thresholds live here so they can be tuned in one place.
# These are conservative first-pass values; the spec requires empirical tuning
# against labelled clips before trusting them (>85% separation on TH/VOT/pitch).
# --------------------------------------------------------------------------- #

_ARPA_STOP_BURST = {"P", "T", "K", "B", "D", "G"}


def _th_voiceless(o: PhoneObservation) -> bool:
    # Aligner returns T (or D) where TH expected; a stop burst confirms it.
    if o.expected_arpabet != "TH":
        return False
    produced_is_stop = o.produced_arpabet in {"T", "D"}
    burst = bool(o.burst_present) or (o.closure_ms or 0) > 20
    return produced_is_stop or burst


def _th_voiced(o: PhoneObservation) -> bool:
    if o.expected_arpabet != "DH":
        return False
    return o.produced_arpabet in {"D", "T"} or bool(o.burst_present)


def _retroflex_stop(target: str) -> Callable[[PhoneObservation], bool]:
    def _fn(o: PhoneObservation) -> bool:
        if o.expected_arpabet != target:
            return False
        # Retroflexion signature: lowered F3 at the closure/transition.
        # We only have the aligned segment, so use F3 dip if present.
        return o.f3 is not None and o.f3 < 2500
    return _fn


def _v_w_merge(o: PhoneObservation) -> bool:
    if o.expected_arpabet not in {"V", "W"}:
        return False
    # /v/ realized without labiodental frication, or /w/ with frication.
    if o.expected_arpabet == "V":
        low_frication = (o.spectral_centroid or 9999) < 1500
        return low_frication or o.produced_arpabet == "W"
    return o.produced_arpabet == "V"


def _no_aspiration(o: PhoneObservation) -> bool:
    if o.expected_arpabet not in {"P", "T", "K"} or not o.is_word_initial:
        return False
    return o.vot_ms is not None and o.vot_ms < 30  # GA target ~60-80ms


def _final_devoice(o: PhoneObservation) -> bool:
    if not o.is_word_final:
        return False
    if o.expected_arpabet not in {"B", "D", "G", "V", "Z", "ZH", "JH"}:
        return False
    # Devoicing shows as very low voicing in the final closure.
    return o.voicing_ratio is not None and o.voicing_ratio < 0.35


def _clear_l_only(o: PhoneObservation) -> bool:
    if o.expected_arpabet != "L" or not o.is_coda:
        return False
    # Dark /l/ has a low F2 (<1000Hz). Clear /l/ in coda keeps F2 high.
    return o.f2 is not None and o.f2 > 1100


def _r_tap(o: PhoneObservation) -> bool:
    if o.expected_arpabet != "R":
        return False
    too_short = o.duration_ms is not None and o.duration_ms < 40
    f3_not_lowered = o.f3 is not None and o.f3 > 2000
    return too_short or f3_not_lowered


def _ng_cluster(o: PhoneObservation) -> bool:
    if o.expected_arpabet != "NG":
        return False
    # An extra stop burst after the nasal = inserted /g/.
    return bool(o.burst_present)


def _s_cluster_epenthesis(o: PhoneObservation) -> bool:
    # Epenthetic vowel before a word-initial /s/ + consonant cluster.
    if o.expected_arpabet != "S" or not o.is_word_initial:
        return False
    # Detected upstream as an inserted vowel; flagged via produced phone.
    return o.produced_arpabet in {"IH", "AH", "IY"} and o.position_in_word == 0


def _ae_epsilon(o: PhoneObservation) -> bool:
    if o.expected_arpabet != "AE":
        return False
    # /ae/ needs a high F1 (open jaw). Raised to /eh/ lowers F1.
    return o.f1 is not None and o.f1 < 650


def _schwa_missing(o: PhoneObservation) -> bool:
    # Unstressed vowel kept full instead of reduced to schwa.
    if o.expected_arpabet != "AH":  # AH0 is schwa in ARPAbet
        return False
    long = o.duration_ms is not None and o.duration_ms > 90
    not_central = o.f1 is not None and o.f2 is not None and not (
        450 < o.f1 < 650 and 1100 < o.f2 < 1600
    )
    return long or not_central


def _tense_lax(pair_target: str) -> Callable[[PhoneObservation], bool]:
    def _fn(o: PhoneObservation) -> bool:
        if o.expected_arpabet != pair_target:
            return False
        return o.produced_arpabet != pair_target and o.feature_distance is not None
    return _fn


def _diphthong_flat(o: PhoneObservation) -> bool:
    if o.expected_arpabet not in {"OW", "EY", "AY", "AW", "OY"}:
        return False
    traj = o.f2_trajectory
    if not traj or len(traj) < 3:
        return False
    movement = max(traj) - min(traj)
    return movement < 200  # Hz; a real diphthong sweeps far more


def _caught_cot(o: PhoneObservation) -> bool:
    if o.expected_arpabet != "AA":
        return False
    # Over-rounded /ao/ pulls F2 down.
    return o.f2 is not None and o.f2 < 900


def _rhotic_vowel(o: PhoneObservation) -> bool:
    if o.expected_arpabet not in {"ER"}:
        return False
    return o.f3 is not None and o.f3 > 2100  # R-colouring needs low F3 throughout


def _non_rhotic(o: PhoneObservation) -> bool:
    if o.expected_arpabet != "R" or not (o.is_coda or o.is_word_final):
        return False
    dropped = o.duration_ms is not None and o.duration_ms < 25
    f3_high = o.f3 is not None and o.f3 > 2200
    return dropped or f3_high


# --------------------------------------------------------------------------- #
# Consonant rules (1A)
# --------------------------------------------------------------------------- #

CONSONANT_RULES: list[PhoneRule] = [
    PhoneRule(
        id="TH_VOICELESS",
        category=Category.CONSONANT,
        target_ipa="θ",
        target_arpabet="TH",
        common_error_ipa="t̪",
        severity=4,
        intelligibility_weight=0.7,
        explanation="You produced a stop where the 'th' should be a continuous "
        "airflow sound. This is the single most recognisable marker.",
        articulation_cue="Tongue tip lightly between the teeth, blow air "
        "continuously. There is no stop, no burst.",
        mouth_diagram="TH_INTERDENTAL",
        minimal_pairs=["think/tink", "thin/tin", "three/tree", "math/mat"],
        expected_arpabet=("TH",),
        confused_with=("T", "D"),
        detect=_th_voiceless,
    ),
    PhoneRule(
        id="TH_VOICED",
        category=Category.CONSONANT,
        target_ipa="ð",
        target_arpabet="DH",
        common_error_ipa="d̪",
        severity=4,
        intelligibility_weight=0.65,
        explanation="The voiced 'th' became a hard /d/ stop.",
        articulation_cue="Same tongue position as 'think', now add voice. Feel "
        "the throat buzz. Air keeps flowing.",
        mouth_diagram="TH_INTERDENTAL",
        minimal_pairs=["this/dis", "they/day", "then/den", "breathe/breed"],
        expected_arpabet=("DH",),
        confused_with=("D", "T"),
        detect=_th_voiced,
    ),
    PhoneRule(
        id="RETROFLEX_T",
        category=Category.CONSONANT,
        target_ipa="t",
        target_arpabet="T",
        common_error_ipa="ʈ",
        severity=3,
        intelligibility_weight=0.4,
        explanation="The /t/ was curled back onto the palate (retroflex).",
        articulation_cue="Tongue tip on the ridge just behind the upper teeth, "
        "not curled back on the palate.",
        mouth_diagram="ALVEOLAR_STOP",
        minimal_pairs=[],
        expected_arpabet=("T",),
        detect=_retroflex_stop("T"),
    ),
    PhoneRule(
        id="RETROFLEX_D",
        category=Category.CONSONANT,
        target_ipa="d",
        target_arpabet="D",
        common_error_ipa="ɖ",
        severity=3,
        intelligibility_weight=0.4,
        explanation="The /d/ was retroflexed.",
        articulation_cue="Flatten the tongue and move it forward to the ridge "
        "behind the upper teeth.",
        mouth_diagram="ALVEOLAR_STOP",
        minimal_pairs=[],
        expected_arpabet=("D",),
        detect=_retroflex_stop("D"),
    ),
    PhoneRule(
        id="V_W_MERGE",
        category=Category.CONSONANT,
        target_ipa="v/w",
        target_arpabet="V",
        common_error_ipa="ʋ",
        severity=4,
        intelligibility_weight=0.6,
        explanation="/v/ and /w/ merged into a single approximant.",
        articulation_cue="/v/: bottom lip touches upper teeth, buzzing. /w/: "
        "lips round with no contact. They are different mouths.",
        mouth_diagram="LABIODENTAL_V",
        minimal_pairs=["vet/wet", "vine/wine", "veil/wail", "vest/west"],
        expected_arpabet=("V", "W"),
        detect=_v_w_merge,
    ),
    PhoneRule(
        id="NO_ASPIRATION",
        category=Category.CONSONANT,
        target_ipa="pʰ tʰ kʰ",
        target_arpabet="P",
        common_error_ipa="p t k",
        severity=3,
        intelligibility_weight=0.45,
        explanation="Word-initial /p t k/ had no puff of air (VOT too short).",
        articulation_cue="Hold a tissue in front of your mouth. It must flutter "
        "on 'pin', 'top', 'cat'.",
        mouth_diagram="ALVEOLAR_STOP",
        minimal_pairs=["pin/bin", "top/dop", "cat/gat"],
        expected_arpabet=("P", "T", "K"),
        detect=_no_aspiration,
    ),
    PhoneRule(
        id="FINAL_DEVOICE",
        category=Category.CONSONANT,
        target_ipa="b d g v z ʒ dʒ",
        target_arpabet="D",
        common_error_ipa="p t k f s ʃ tʃ",
        severity=3,
        intelligibility_weight=0.5,
        explanation="A final voiced consonant lost its voicing.",
        articulation_cue="Lengthen the vowel before it. 'bed' has a longer /ɛ/ "
        "than 'bet'. The vowel carries the voicing cue.",
        mouth_diagram="SCHWA_NEUTRAL",
        minimal_pairs=["bed/bet", "bag/back", "prize/price", "have/half"],
        expected_arpabet=("B", "D", "G", "V", "Z", "ZH", "JH"),
        detect=_final_devoice,
    ),
    PhoneRule(
        id="CLEAR_L_ONLY",
        category=Category.CONSONANT,
        target_ipa="ɫ",
        target_arpabet="L",
        common_error_ipa="l",
        severity=2,
        intelligibility_weight=0.3,
        explanation="Coda /l/ (milk, full, cold) was 'clear' instead of 'dark'.",
        articulation_cue="Back of the tongue humps toward the soft palate. It "
        "sounds almost like a 'w'.",
        mouth_diagram="DARK_L",
        minimal_pairs=[],
        expected_arpabet=("L",),
        detect=_clear_l_only,
    ),
    PhoneRule(
        id="R_TAP",
        category=Category.CONSONANT,
        target_ipa="ɹ",
        target_arpabet="R",
        common_error_ipa="ɾ",
        severity=4,
        intelligibility_weight=0.6,
        explanation="The American /r/ was tapped or trilled instead of held.",
        articulation_cue="No tongue contact at all. Either bunch the tongue body "
        "or curl the tip back. Never tap.",
        mouth_diagram="BUNCHED_R",
        minimal_pairs=[],
        expected_arpabet=("R",),
        detect=_r_tap,
    ),
    PhoneRule(
        id="NG_CLUSTER",
        category=Category.CONSONANT,
        target_ipa="ŋ",
        target_arpabet="NG",
        common_error_ipa="ŋg",
        severity=2,
        intelligibility_weight=0.3,
        explanation="An extra /g/ was inserted after /ŋ/ (sing-ger).",
        articulation_cue="'singer' = /sɪŋər/, no G. But 'finger' = /fɪŋgər/ does "
        "keep the G. It depends on the word.",
        mouth_diagram="SCHWA_NEUTRAL",
        minimal_pairs=["singer/finger"],
        expected_arpabet=("NG",),
        detect=_ng_cluster,
    ),
    PhoneRule(
        id="W_INITIAL",
        category=Category.CONSONANT,
        target_ipa="w",
        target_arpabet="W",
        common_error_ipa="v",
        severity=3,
        intelligibility_weight=0.45,
        explanation="/w/ before rounded vowels became /v/.",
        articulation_cue="'wood', 'would', 'woman' — lips round, never touch the "
        "teeth.",
        mouth_diagram="ROUNDED_W",
        minimal_pairs=["wood/vood", "worse/verse"],
        expected_arpabet=("W",),
        detect=_v_w_merge,
    ),
    PhoneRule(
        id="S_SH_CLUSTER",
        category=Category.CONSONANT,
        target_ipa="s-cluster",
        target_arpabet="S",
        common_error_ipa="ɪs-",
        severity=2,
        intelligibility_weight=0.3,
        explanation="A vowel was inserted before a word-initial /s/ cluster "
        "(i-school).",
        articulation_cue="'school' starts with the S. No vowel before it. Push "
        "straight into the cluster.",
        mouth_diagram="SCHWA_NEUTRAL",
        minimal_pairs=["school/ischool", "start/istart"],
        expected_arpabet=("S",),
        detect=_s_cluster_epenthesis,
    ),
]

# --------------------------------------------------------------------------- #
# Vowel rules (1B)
# --------------------------------------------------------------------------- #

VOWEL_RULES: list[PhoneRule] = [
    PhoneRule(
        id="AE_EPSILON",
        category=Category.VOWEL,
        target_ipa="æ",
        target_arpabet="AE",
        common_error_ipa="ɛ",
        severity=3,
        intelligibility_weight=0.45,
        explanation="/æ/ (bat, man, cat) was raised toward /ɛ/.",
        articulation_cue="Drop the jaw lower than /ɛ/. Wide mouth. 'bat' is not "
        "'bet'.",
        mouth_diagram="AE_OPEN",
        minimal_pairs=["bat/bet", "man/men", "sat/set", "bad/bed"],
        expected_arpabet=("AE",),
        detect=_ae_epsilon,
    ),
    PhoneRule(
        id="SCHWA_MISSING",
        category=Category.VOWEL,
        target_ipa="ə",
        target_arpabet="AH",
        common_error_ipa="full vowel",
        severity=5,  # highest priority error
        intelligibility_weight=0.55,
        explanation="Unstressed syllables kept their full vowel instead of "
        "reducing to schwa. This is the highest-impact error for sounding "
        "native.",
        articulation_cue="'computer' = kəm-PYOO-tər. Unstressed syllables get "
        "lazy, short, and centred. Let them collapse.",
        mouth_diagram="SCHWA_NEUTRAL",
        minimal_pairs=[],
        expected_arpabet=("AH",),
        detect=_schwa_missing,
    ),
    PhoneRule(
        id="TENSE_LAX_I",
        category=Category.VOWEL,
        target_ipa="iː/ɪ",
        target_arpabet="IY",
        common_error_ipa="merged",
        severity=3,
        intelligibility_weight=0.5,
        explanation="/iː/ and /ɪ/ were merged.",
        articulation_cue="'sheep' is long and tense, 'ship' is short and relaxed. "
        "Different vowels, not just length.",
        mouth_diagram="TENSE_I",
        minimal_pairs=["sheep/ship", "beat/bit", "leave/live", "feel/fill"],
        expected_arpabet=("IY", "IH"),
        detect=_tense_lax("IY"),
    ),
    PhoneRule(
        id="TENSE_LAX_U",
        category=Category.VOWEL,
        target_ipa="uː/ʊ",
        target_arpabet="UW",
        common_error_ipa="merged",
        severity=3,
        intelligibility_weight=0.5,
        explanation="/uː/ and /ʊ/ were merged.",
        articulation_cue="'fool' vs 'full', 'pool' vs 'pull'. Tense is long with "
        "tight lips; lax is short and loose.",
        mouth_diagram="LAX_I",
        minimal_pairs=["fool/full", "pool/pull", "Luke/look"],
        expected_arpabet=("UW", "UH"),
        detect=_tense_lax("UW"),
    ),
    PhoneRule(
        id="DIPHTHONG_FLAT",
        category=Category.VOWEL,
        target_ipa="oʊ eɪ aɪ aʊ ɔɪ",
        target_arpabet="OW",
        common_error_ipa="oː eː",
        severity=3,
        intelligibility_weight=0.5,
        explanation="A diphthong was flattened into a single steady vowel.",
        articulation_cue="These are two vowels glued together. 'go' = 'gah-oo'. "
        "The tongue must travel across the vowel.",
        mouth_diagram="DIPHTHONG_GLIDE",
        minimal_pairs=[],
        expected_arpabet=("OW", "EY", "AY", "AW", "OY"),
        detect=_diphthong_flat,
    ),
    PhoneRule(
        id="CAUGHT_COT",
        category=Category.VOWEL,
        target_ipa="ɑ",
        target_arpabet="AA",
        common_error_ipa="ɔ",
        severity=2,
        intelligibility_weight=0.25,
        explanation="/ɑ/ was over-rounded toward /ɔ/.",
        articulation_cue="General American merges these. 'caught' = 'cot'. "
        "Unround the lips and open the jaw.",
        mouth_diagram="AE_OPEN",
        minimal_pairs=["caught/cot", "dawn/don"],
        expected_arpabet=("AA",),
        detect=_caught_cot,
    ),
    PhoneRule(
        id="RHOTIC_VOWELS",
        category=Category.VOWEL,
        target_ipa="ɚ/ɝ",
        target_arpabet="ER",
        common_error_ipa="non-rhotic",
        severity=4,
        intelligibility_weight=0.55,
        explanation="R-coloured vowels (bird, teacher) lost their R colour.",
        articulation_cue="The R colours the whole vowel. F3 must stay low for the "
        "entire vowel, not just at the end.",
        mouth_diagram="BUNCHED_R",
        minimal_pairs=[],
        expected_arpabet=("ER",),
        detect=_rhotic_vowel,
    ),
    PhoneRule(
        id="NON_RHOTIC",
        category=Category.VOWEL,
        target_ipa="ɹ",
        target_arpabet="R",
        common_error_ipa="dropped",
        severity=4,
        intelligibility_weight=0.55,
        explanation="A final or pre-consonantal R was dropped (cah, fathe).",
        articulation_cue="General American is fully rhotic. Every written R is "
        "pronounced, including at the ends of words.",
        mouth_diagram="RETROFLEX_R",
        minimal_pairs=[],
        expected_arpabet=("R",),
        detect=_non_rhotic,
    ),
]


# --------------------------------------------------------------------------- #
# Prosody rules (1C) — weighted highest, this is the "monotone" problem.
# --------------------------------------------------------------------------- #

PROSODY_RULES: list[ProsodyRule] = [
    ProsodyRule(
        id="SYLLABLE_TIMED",
        category=Category.PROSODY,
        metric="nPVI of vowel durations",
        unit="nPVI",
        severity=5,
        intelligibility_weight=0.7,
        target_range=(55, 70),
        explanation="Your syllables are too evenly timed (syllable-timed). "
        "English is stress-timed: it squeezes unstressed syllables hard.",
        drill_suggestion="Clap only on the stressed syllables and let everything "
        "between them collapse and speed up. 'CAN you COME to the PARty' — three "
        "claps, the rest is mush.",
        detect=lambda m: (m.npvi < 45, m.npvi),
    ),
    ProsodyRule(
        id="FLAT_PITCH",
        category=Category.PROSODY,
        metric="F0 range across utterance",
        unit="st",
        severity=5,
        intelligibility_weight=0.65,
        target_range=(10, 14),
        explanation="Your voice barely moves in pitch. This reads as monotone "
        "and 'no emotion'.",
        drill_suggestion="Exaggerate to twice what feels natural. It will sound "
        "normal to a native ear. Practise pitch sirens: glide low to high to low.",
        detect=lambda m: (m.f0_range_st < 6, m.f0_range_st),
    ),
    ProsodyRule(
        id="WORD_STRESS_WRONG",
        category=Category.PROSODY,
        metric="stressed syllable index vs CMUdict",
        unit="mismatches",
        severity=4,
        intelligibility_weight=0.6,
        target_range=(0, 0),
        explanation="You stressed the wrong syllable in one or more words.",
        drill_suggestion="The stressed syllable is louder AND longer AND higher "
        "pitch, all three at once. 'PHOtograph' vs 'phoTOGraphy'.",
        detect=lambda m: (m.word_stress_mismatches > 0, float(m.word_stress_mismatches)),
    ),
    ProsodyRule(
        id="SENTENCE_STRESS_FLAT",
        category=Category.PROSODY,
        metric="intensity variance content vs function words",
        unit="ratio",
        severity=4,
        intelligibility_weight=0.55,
        target_range=(1.3, 3.0),
        explanation="Content words and function words got equal weight.",
        drill_suggestion="Content words (nouns, verbs, adjectives, adverbs) get "
        "stress. Function words (the, of, is, to, a) get crushed almost to "
        "nothing.",
        detect=lambda m: (
            m.content_function_intensity_ratio < 1.3,
            m.content_function_intensity_ratio,
        ),
    ),
    ProsodyRule(
        id="NUCLEAR_MISPLACED",
        category=Category.PROSODY,
        metric="position of largest pitch movement",
        unit="bool",
        severity=4,
        intelligibility_weight=0.55,
        explanation="The biggest pitch move did not land on the focus word.",
        drill_suggestion="The most important word carries the biggest pitch move, "
        "usually near the end. Decide the focus word, then land the melody on it.",
        detect=lambda m: (not m.nuclear_on_focus, 0.0 if m.nuclear_on_focus else 1.0),
    ),
    ProsodyRule(
        id="NO_LINKING",
        category=Category.PROSODY,
        metric="inter-word gap mid-phrase",
        unit="ms",
        severity=3,
        intelligibility_weight=0.45,
        target_range=(0, 60),
        explanation="You left silent gaps between words inside a phrase.",
        drill_suggestion="'an apple' becomes 'a-napple'. Consonant endings glue "
        "onto vowel beginnings. Run the phrase together.",
        detect=lambda m: (m.max_interword_gap_ms > 60, m.max_interword_gap_ms),
    ),
    ProsodyRule(
        id="TERMINAL_RISE",
        category=Category.PROSODY,
        metric="final F0 contour on declaratives",
        unit="bool",
        severity=3,
        intelligibility_weight=0.4,
        explanation="Your statement rose at the end like a question.",
        drill_suggestion="Statements fall at the end. Only yes/no questions rise. "
        "Drop your pitch on the last stressed syllable.",
        detect=lambda m: (m.terminal_rising, 1.0 if m.terminal_rising else 0.0),
    ),
    ProsodyRule(
        id="SPEECH_RATE",
        category=Category.PROSODY,
        metric="syllables per second",
        unit="syll/s",
        severity=2,
        intelligibility_weight=0.35,
        target_range=(3.5, 5.0),
        explanation="Your speech rate is outside the natural conversational band.",
        drill_suggestion="Too slow reads as hesitant, too fast as unclear. Aim "
        "for 3.5 to 5 syllables per second.",
        detect=lambda m: (
            m.speech_rate_syll_s < 3.0 or m.speech_rate_syll_s > 5.5,
            m.speech_rate_syll_s,
        ),
    ),
    ProsodyRule(
        id="FILLER_DENSITY",
        category=Category.PROSODY,
        metric="fillers per 100 words",
        unit="per 100w",
        severity=2,
        intelligibility_weight=0.3,
        target_range=(0, 5),
        explanation="Too many fillers (um, uh, like).",
        drill_suggestion="Silence beats 'um'. Pause instead. A confident pause "
        "reads as thoughtful; a filler reads as unsure.",
        detect=lambda m: (m.filler_per_100w > 5, m.filler_per_100w),
    ),
]


# NO_FLAPPING and NO_CONTRACTION are connected-speech rules detected at the
# transcript/segment level rather than from the metric bundle. They are declared
# here so the report and curriculum layers can reference them by id.
CONNECTED_SPEECH_RULES: list[ProsodyRule] = [
    ProsodyRule(
        id="NO_FLAPPING",
        category=Category.PROSODY,
        metric="/t/ closure between vowels",
        unit="ms",
        severity=3,
        intelligibility_weight=0.45,
        target_range=(0, 40),
        explanation="Intervocalic /t/ was a full stop instead of a flap.",
        drill_suggestion="'water' becomes 'wader', 'better' becomes 'bedder', "
        "'lot of' becomes 'lodda'. A quick tap, not a hard T.",
        detect=lambda m: (False, 0.0),  # fired by segment-level detector
    ),
    ProsodyRule(
        id="NO_CONTRACTION",
        category=Category.PROSODY,
        metric="full forms in casual speech",
        unit="count",
        severity=2,
        intelligibility_weight=0.3,
        explanation="Full forms used where a contraction is natural.",
        drill_suggestion="'I am' becomes 'I'm', 'do not' becomes 'don't', 'going "
        "to' becomes 'gonna'. Full forms sound stiff and foreign.",
        detect=lambda m: (False, 0.0),  # fired by transcript-level detector
    ),
]


# --------------------------------------------------------------------------- #
# Registry access
# --------------------------------------------------------------------------- #

ALL_PHONE_RULES: list[PhoneRule] = CONSONANT_RULES + VOWEL_RULES
ALL_PROSODY_RULES: list[ProsodyRule] = PROSODY_RULES + CONNECTED_SPEECH_RULES

_PHONE_BY_ID = {r.id: r for r in ALL_PHONE_RULES}
_PROSODY_BY_ID = {r.id: r for r in ALL_PROSODY_RULES}


def phone_rule(rule_id: str) -> Optional[PhoneRule]:
    return _PHONE_BY_ID.get(rule_id)


def prosody_rule(rule_id: str) -> Optional[ProsodyRule]:
    return _PROSODY_BY_ID.get(rule_id)


def all_rule_ids() -> list[str]:
    return list(_PHONE_BY_ID.keys()) + list(_PROSODY_BY_ID.keys())


def phone_rules_for_expected(arpabet_no_stress: str) -> list[PhoneRule]:
    """Return phone rules that could fire for a given expected ARPAbet symbol."""
    return [r for r in ALL_PHONE_RULES if arpabet_no_stress in r.expected_arpabet]
