"""Minimal pair generator.

Given a target phoneme contrast, find real word pairs differing only in that
phoneme. Uses CMUdict via the `pronouncing` library when available; otherwise
falls back to the curated pairs already attached to each taxonomy rule. Filters
by a small high-frequency word list so drills use common words.
"""

from __future__ import annotations

from phonetics import error_profile as ep

try:
    import pronouncing  # type: ignore
    _HAS = True
except Exception:
    _HAS = False


# Compact high-frequency filter so generated pairs stay usable in drills.
_COMMON = None


def _common() -> set[str]:
    global _COMMON
    if _COMMON is None:
        # A small seed list; extend with a real frequency table in production.
        _COMMON = set(
            "the be to of and a in that have i it for not on with he as you do at "
            "this but his by from they we say her she or an will my one all would "
            "there their what so up out if about who get which go me when make can "
            "like time no just him know take people into year your good some could "
            "them see other than then now look only come its over think also back "
            "after use two how our work first well way even new want because any "
            "these give day most us think thing man world life hand part eye woman "
            "place week case point government company number group problem fact "
            "bat bet man men sat set bad bed sheep ship beat bit leave live feel "
            "fill fool full pool pull think tink thin tin three tree math mat this "
            "day they then den vet wet vine wine veil wail vest west pin bin top "
            "cat bird water better".split()
        )
    return _COMMON


def pairs_for_rule(rule_id: str, limit: int = 8) -> list[str]:
    rule = ep.phone_rule(rule_id)
    if not rule:
        return []
    if rule.minimal_pairs:
        return rule.minimal_pairs[:limit]
    if not _HAS or not rule.confused_with:
        return []
    return _generate(rule.target_arpabet, rule.confused_with[0], limit)


def _generate(target_arpa: str, confuse_arpa: str, limit: int) -> list[str]:
    """Find CMUdict words whose pronunciation contains the target phone and a
    minimally different partner substituting the confused phone."""
    out: list[str] = []
    common = _common()
    seen = set()
    for word in common:
        phones_list = pronouncing.phones_for_word(word)
        if not phones_list:
            continue
        phones = phones_list[0].split()
        bare = [p.rstrip("012") for p in phones]
        if target_arpa not in bare:
            continue
        # build the partner pronunciation
        partner = [confuse_arpa if p == target_arpa else p for p in bare]
        partner_key = " ".join(partner)
        for cand in common:
            if cand == word or cand in seen:
                continue
            cl = pronouncing.phones_for_word(cand)
            if cl and [p.rstrip("012") for p in cl[0].split()] == partner:
                out.append(f"{word}/{cand}")
                seen.add(word)
                seen.add(cand)
                break
        if len(out) >= limit:
            break
    return out
