"""Grapheme-to-phoneme: target text -> expected ARPAbet with stress markers.

Uses g2p-en when available. Falls back to a small CMU-style lookup for the
words used in the seed drill library so the pipeline is testable without the
model. Stress digits (0/1/2) are preserved on vowels.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from analysis.phone_compare import ExpectedPhone, strip_stress

_VOWELS = {
    "AA", "AE", "AH", "AO", "AW", "AY", "EH", "ER", "EY", "IH", "IY",
    "OW", "OY", "UH", "UW",
}


@dataclass
class G2PWord:
    word: str
    phones: list[str]  # ARPAbet with stress digits on vowels


def available() -> bool:
    try:
        import g2p_en  # noqa: F401
        return True
    except Exception:
        return False


@lru_cache(maxsize=1)
def _g2p():
    from g2p_en import G2p

    return G2p()


def phonemize(text: str) -> list[G2PWord]:
    """Return per-word ARPAbet. Uses g2p-en; empty list if unavailable."""
    if not available():
        return []
    g2p = _g2p()
    tokens = g2p(text)
    words: list[G2PWord] = []
    current: list[str] = []
    # g2p-en emits phones and word-separating spaces / punctuation
    raw_words = [w for w in text.split() if any(c.isalpha() for c in w)]
    wi = 0
    for tok in tokens:
        if tok == " ":
            if current and wi < len(raw_words):
                words.append(G2PWord(word=raw_words[wi], phones=current))
                wi += 1
                current = []
        elif tok.strip() and any(c.isalnum() for c in tok):
            current.append(tok)
    if current and wi < len(raw_words):
        words.append(G2PWord(word=raw_words[wi], phones=current))
    return words


def to_expected_phones(words: list[G2PWord]) -> list[ExpectedPhone]:
    """Flatten g2p words into positioned ExpectedPhone records.

    is_coda is approximated as: a consonant after the last vowel of the word.
    """
    out: list[ExpectedPhone] = []
    for gw in words:
        n = len(gw.phones)
        last_vowel_idx = -1
        for i, ph in enumerate(gw.phones):
            if strip_stress(ph) in _VOWELS:
                last_vowel_idx = i
        for i, ph in enumerate(gw.phones):
            bare = strip_stress(ph)
            is_cons = bare not in _VOWELS
            out.append(
                ExpectedPhone(
                    arpabet=ph,
                    word=gw.word,
                    position_in_word=i,
                    is_word_initial=(i == 0),
                    is_word_final=(i == n - 1),
                    is_coda=is_cons and last_vowel_idx >= 0 and i > last_vowel_idx,
                )
            )
    return out


def stress_pattern(words: list[G2PWord]) -> list[list[int]]:
    """Per-word list of stress digits on vowels (1=primary, 2=secondary, 0=none)."""
    patterns: list[list[int]] = []
    for gw in words:
        stresses: list[int] = []
        for ph in gw.phones:
            if strip_stress(ph) in _VOWELS:
                digit = next((int(c) for c in ph if c.isdigit()), 0)
                stresses.append(digit)
        patterns.append(stresses)
    return patterns
