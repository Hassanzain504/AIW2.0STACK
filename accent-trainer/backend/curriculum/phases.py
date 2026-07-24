"""Curriculum data: the six-phase programme and the 25-minute daily template.

Static data the frontend renders in the curriculum rail and the session timer.
Drills reference error rule ids so the scheduler can target them.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Drill:
    label: str
    target_rules: list[str]
    prompts: list[str] = field(default_factory=list)


@dataclass
class Phase:
    index: int
    weeks: str
    name: str
    focus: str
    drills: list[Drill]


PHASES: list[Phase] = [
    Phase(1, "1-3", "Foundation sounds",
          "The consonants that mark a non-native accent first.",
          [
              Drill("TH voiceless/voiced", ["TH_VOICELESS", "TH_VOICED"],
                    ["think", "three things", "this and that", "mother's birthday"]),
              Drill("Alveolar T/D (de-retroflexion)", ["RETROFLEX_T", "RETROFLEX_D"],
                    ["today", "little", "medal", "water bottle"]),
              Drill("Aspiration (tissue test)", ["NO_ASPIRATION"],
                    ["pin", "top", "cat", "party time"]),
              Drill("V/W separation", ["V_W_MERGE", "W_INITIAL"],
                    ["vet wet", "vine wine", "very well", "we visited Vienna"]),
              Drill("Schwa introduction", ["SCHWA_MISSING"],
                    ["computer", "banana", "about a problem"]),
          ]),
    Phase(2, "4-6", "Vowel system",
          "The full GA vowel inventory, starting with the hardest contrasts.",
          [
              Drill("ae vs eh vs ah", ["AE_EPSILON", "CAUGHT_COT"],
                    ["bat bet", "man men", "cat caught cot"]),
              Drill("Tense/lax pairs", ["TENSE_LAX_I", "TENSE_LAX_U"],
                    ["sheep ship", "fool full", "leave live"]),
              Drill("Diphthong trajectories", ["DIPHTHONG_FLAT"],
                    ["go home", "day", "my time", "how now"]),
              Drill("Rhotic vowels", ["RHOTIC_VOWELS", "NON_RHOTIC"],
                    ["bird", "teacher", "further order"]),
          ]),
    Phase(3, "7-10", "Rhythm (the big one)",
          "Stress-timing. Crush the unstressed syllables.",
          [
              Drill("Stress-timing clap drills", ["SYLLABLE_TIMED"],
                    ["Can you come to the party?",
                     "I wanted to tell you about it."]),
              Drill("Word stress by suffix", ["WORD_STRESS_WRONG"],
                    ["information", "ability", "photographic", "celebrate"]),
              Drill("Content vs function reduction", ["SENTENCE_STRESS_FLAT"],
                    ["I gave the book to the man.",
                     "She was going to the store."]),
              Drill("Weak forms", ["SCHWA_MISSING"],
                    ["a cup of tea", "bread and butter", "I can do it"]),
          ]),
    Phase(4, "11-14", "Melody and expression",
          "Widen the pitch range. Place the nucleus. Colour with emotion.",
          [
              Drill("Pitch range expansion", ["FLAT_PITCH"],
                    ["That is amazing!", "Really? I had no idea."]),
              Drill("Nuclear stress placement", ["NUCLEAR_MISPLACED"],
                    ["I said the RED one, not the blue one."]),
              Drill("Intonation contours", ["TERMINAL_RISE"],
                    ["It's raining. (fall)", "Is it raining? (rise)"]),
              Drill("Emotional colouring", ["FLAT_PITCH"],
                    ["That's the third one. (neutral/excited/doubtful/emphatic/sarcastic)"]),
          ]),
    Phase(5, "15-18", "Connected speech",
          "Link, flap, contract, reduce. Native speed.",
          [
              Drill("Linking", ["NO_LINKING"],
                    ["an apple", "turn it off", "far away"]),
              Drill("Flapping", ["NO_FLAPPING"],
                    ["water", "better", "a lot of it"]),
              Drill("Contractions and reductions", ["NO_CONTRACTION"],
                    ["I'm gonna", "I don't wanna", "let me see"]),
              Drill("Shadowing at native speed", ["SYLLABLE_TIMED", "FLAT_PITCH"],
                    []),
          ]),
    Phase(6, "ongoing", "Free speech and articulation",
          "Transfer to spontaneous speech.",
          [
              Drill("Picture description (60s)", []),
              Drill("Opinion monologue (90s)", []),
              Drill("Structured argument (2min)", []),
              Drill("Read-aloud, professional content", []),
          ]),
]


@dataclass
class SessionBlock:
    minutes: int
    name: str
    content: str


DAILY_SESSION: list[SessionBlock] = [
    SessionBlock(3, "Warm-up", "Lip trills, humming glides, jaw release, pitch sirens"),
    SessionBlock(5, "Sound focus", "Today's target phoneme: isolation -> minimal pairs -> words"),
    SessionBlock(5, "Minimal pairs", "Perception test (hear + identify) then production"),
    SessionBlock(6, "Sentence drill", "Sentences loaded with target sound + prosody focus"),
    SessionBlock(4, "Shadowing", "Reference audio, 3 passes: listen / overlap / solo"),
    SessionBlock(2, "Free speech", "Random prompt, recorded, analysed, logged"),
]


# Phonetically balanced weekly assessment passage (public domain, Rainbow Passage
# opening). Same passage every week so progress is measurable on identical text.
ASSESSMENT_PASSAGE = (
    "When the sunlight strikes raindrops in the air, they act as a prism and "
    "form a rainbow. The rainbow is a division of white light into many "
    "beautiful colors. These take the shape of a long round arch, with its "
    "path high above, and its two ends apparently beyond the horizon."
)
