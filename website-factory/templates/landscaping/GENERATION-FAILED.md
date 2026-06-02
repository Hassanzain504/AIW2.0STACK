# Niche template generation failed

Gate: **Gate 1 — brand-dna shape**

Timestamp: 2026-06-01T17:59:48.718435+00:00

## Detail

```
Required file(s) missing:
  templates/landscaping/scripts/validate-brand-dna.mjs
  templates/landscaping/src/config/brand-dna.js
  templates/landscaping/src/config/brand-dna.example.js
```

## What happens now

`tools/build-from-template.py` detects this marker file and halts the per-client pipeline when this niche is active. There is no fallback to a shared baseline template. To retry generation, re-run `/build-niche-template` after addressing the failure.
