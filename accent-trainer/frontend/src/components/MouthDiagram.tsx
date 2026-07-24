/**
 * MouthDiagram — reusable SVG vocal-tract cross-sections with the tongue as an
 * animatable path. A subset of the ~15 diagrams in the spec; the shape library
 * is keyed so error cards and drills can reference a diagram by name. The
 * DIPHTHONG_GLIDE variant animates the tongue path to show the movement.
 */

interface Props {
  variant: string;
  className?: string;
  animated?: boolean;
}

// Each diagram: a face-profile outline plus a tongue path. Coordinates are in a
// 100x100 viewBox. Simplified but anatomically suggestive (lips left, throat
// right, palate along the top, teeth near the lips).
const TONGUE: Record<string, string> = {
  TH_INTERDENTAL: "M22,66 Q40,58 52,60 Q60,61 58,52 Q40,50 26,58 Z",
  ALVEOLAR_STOP: "M24,66 Q44,60 60,50 Q64,48 60,58 Q44,64 26,68 Z",
  RETROFLEX_STOP: "M24,66 Q46,64 62,54 Q70,48 62,44 Q50,54 26,66 Z",
  BUNCHED_R: "M26,66 Q46,56 58,58 Q66,60 62,66 Q46,70 28,70 Z",
  RETROFLEX_R: "M26,66 Q48,64 62,52 Q68,44 60,42 Q50,54 28,66 Z",
  DARK_L: "M26,66 Q44,62 54,56 Q60,52 64,60 Q68,70 62,72 Q44,72 28,70 Z",
  CLEAR_L: "M24,66 Q44,58 60,48 Q64,46 60,56 Q44,64 26,68 Z",
  LABIODENTAL_V: "M24,66 Q42,62 52,60 Q58,60 56,54 Q42,54 26,62 Z",
  ROUNDED_W: "M26,66 Q44,60 56,60 Q64,60 62,66 Q46,70 28,70 Z",
  SCHWA_NEUTRAL: "M26,66 Q46,62 60,62 Q66,62 62,68 Q46,70 28,70 Z",
  AE_OPEN: "M26,70 Q46,68 60,70 Q66,70 62,76 Q46,78 28,76 Z",
  EPSILON_MID: "M26,66 Q46,64 60,64 Q66,64 62,70 Q46,72 28,70 Z",
  TENSE_I: "M26,60 Q46,52 60,50 Q66,50 62,58 Q46,62 28,64 Z",
  LAX_I: "M26,62 Q46,58 58,58 Q64,58 62,64 Q46,66 28,66 Z",
};

export function MouthDiagram({ variant, className, animated }: Props) {
  const isGlide = variant === "DIPHTHONG_GLIDE";
  const from = TONGUE.AE_OPEN;
  const to = TONGUE.TENSE_I;
  const tongue = TONGUE[variant] ?? TONGUE.SCHWA_NEUTRAL;

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={variant}>
      {/* head profile */}
      <path
        d="M12,20 Q40,8 72,18 Q92,26 90,52 Q88,78 64,90 Q40,98 22,86 Q10,78 12,60 Z"
        fill="#161A1F"
        stroke="#232830"
        strokeWidth={1.5}
      />
      {/* hard palate */}
      <path d="M20,42 Q50,30 82,40" fill="none" stroke="#3A424D" strokeWidth={2} />
      {/* upper teeth */}
      <path d="M18,50 l0,8 l4,0 l0,-8" fill="#7A8290" />
      {/* lips */}
      <path d="M14,54 Q10,58 14,64" fill="none" stroke="#7A8290" strokeWidth={2} />

      {/* tongue */}
      {isGlide && animated ? (
        <path fill="#F0552B" opacity={0.85}>
          <animate
            attributeName="d"
            values={`${from};${to};${from}`}
            dur="1.8s"
            repeatCount="indefinite"
          />
        </path>
      ) : (
        <path d={tongue} fill="#F0552B" opacity={0.85} />
      )}
    </svg>
  );
}
