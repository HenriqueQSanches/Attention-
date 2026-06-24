import { sigilById } from "./data.ts";

type Props = {
  sigil: string;
  accent: string;
  size?: number;
};

export function Avatar({ sigil, accent, size = 96 }: Props) {
  const s = sigilById(sigil);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={`Avatar ${s.label}`}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#glow)" />
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.55"
      />
      <g transform="translate(12 12) scale(1)">
        {s.paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.fill ? accent : "none"}
            stroke={accent}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
}
