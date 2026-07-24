"""Unit tests for the dependency-light maths that the thresholds ride on.

These do not need audio or ML models. They lock in the metric definitions the
spec's validation step depends on (nPVI separation, semitone normalisation).
"""

import math

from analysis import prosody
from phonetics import error_profile as ep
from phonetics.error_profile import PhoneObservation, ProsodyMetrics


def test_npvi_even_is_low():
    # perfectly even durations -> nPVI 0 (syllable-timed)
    assert prosody.npvi([100, 100, 100, 100]) == 0.0


def test_npvi_alternating_is_high():
    # strong long/short alternation -> high nPVI (stress-timed)
    val = prosody.npvi([200, 50, 200, 50, 200])
    assert val > 80


def test_semitone_normalisation_is_speaker_relative():
    # a male (low) and female (high) contour with the same shape ratio should
    # map to the same semitone values
    male = [100, 150, 100]
    female = [200, 300, 200]
    ms = prosody.hz_to_semitones(male)
    fs = prosody.hz_to_semitones(female)
    for a, b in zip(ms, fs):
        assert abs(a - b) < 1e-6


def test_f0_range_flat_is_small():
    flat = [120.0] * 20
    assert prosody.f0_range_semitones(flat) < 1.0


def test_f0_range_wide():
    wide = [100 + i * 5 for i in range(20)]  # ramps ~ up an octave
    assert prosody.f0_range_semitones(wide) > 6.0


def test_flat_pitch_rule_fires():
    rule = ep.prosody_rule("FLAT_PITCH")
    m = ProsodyMetrics(npvi=60, f0_range_st=4.0, speech_rate_syll_s=4.0,
                       filler_per_100w=0, content_function_intensity_ratio=1.5,
                       nuclear_on_focus=True, max_interword_gap_ms=0,
                       terminal_rising=False, word_stress_mismatches=0)
    fired, measured = rule.detect(m)
    assert fired and measured == 4.0


def test_syllable_timed_rule_fires():
    rule = ep.prosody_rule("SYLLABLE_TIMED")
    m = ProsodyMetrics(npvi=30, f0_range_st=12, speech_rate_syll_s=4,
                       filler_per_100w=0, content_function_intensity_ratio=1.5,
                       nuclear_on_focus=True, max_interword_gap_ms=0,
                       terminal_rising=False, word_stress_mismatches=0)
    fired, _ = rule.detect(m)
    assert fired


def test_th_voiceless_detector_separates():
    # produced a stop where TH expected -> should fire
    bad = PhoneObservation(expected_arpabet="TH", produced_arpabet="T",
                           expected_ipa="θ", produced_ipa="t", word="think",
                           position_in_word=0, start_ms=0, end_ms=80,
                           burst_present=True, closure_ms=30)
    good = PhoneObservation(expected_arpabet="TH", produced_arpabet="TH",
                            expected_ipa="θ", produced_ipa="θ", word="think",
                            position_in_word=0, start_ms=0, end_ms=80,
                            burst_present=False, closure_ms=0)
    rule = ep.phone_rule("TH_VOICELESS")
    assert rule.detect(bad) is True
    assert rule.detect(good) is False


def test_no_aspiration_vot_threshold():
    rule = ep.phone_rule("NO_ASPIRATION")
    unaspirated = PhoneObservation(expected_arpabet="P", produced_arpabet="P",
                                   expected_ipa="p", produced_ipa="p", word="pin",
                                   position_in_word=0, start_ms=0, end_ms=90,
                                   vot_ms=12, is_word_initial=True)
    aspirated = PhoneObservation(expected_arpabet="P", produced_arpabet="P",
                                 expected_ipa="p", produced_ipa="p", word="pin",
                                 position_in_word=0, start_ms=0, end_ms=90,
                                 vot_ms=70, is_word_initial=True)
    assert rule.detect(unaspirated) is True
    assert rule.detect(aspirated) is False
