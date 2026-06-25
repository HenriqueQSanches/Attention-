import type { HairPart } from "./data.ts";
import { hairsBySex, sigilById } from "./data.ts";

type Props = {
  sigil: string;
  accent: string;
  sex?: "M" | "F";
  hair?: string;
  size?: number;
};

function HairShape({ part, accent }: { part: HairPart; accent: string }) {
  const fill = accent;
  const stroke = accent;
  if (part.d !== undefined) {
    return (
      <path
        d={part.d}
        fill={fill}
        fillOpacity="0.88"
        stroke={stroke}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    );
  }
  return (
    <circle
      cx={part.cx}
      cy={part.cy}
      r={part.r}
      fill={fill}
      fillOpacity="0.88"
      stroke={stroke}
      strokeWidth="0.5"
    />
  );
}

export function CharacterSprite({ sigil, accent, sex = "M", hair, size = 120 }: Props) {
  const s = sigilById(sigil);
  const hairs = hairsBySex(sex);
  const hairStyle = hairs.find((h) => h.id === hair) ?? hairs[0];
  const backParts = hairStyle.parts.filter((p) => p.layer === "back");
  const mainParts = hairStyle.parts.filter((p) => p.layer === "main");
  const frontParts = hairStyle.parts.filter((p) => p.layer === "front");

  return (
    <svg
      width={size}
      height={Math.round(size * 1.4)}
      viewBox="0 0 60 84"
      role="img"
      aria-label="Herói"
      style={{ overflow: "hidden" }}
    >
      {backParts.map((p, i) => (
        <HairShape key={`back-${i}`} part={p} accent={accent} />
      ))}

      <rect x="16" y="55" width="12" height="24" rx="5" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="1.2" />
      <rect x="32" y="55" width="12" height="24" rx="5" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="1.2" />

      <rect x="5" y="30" width="10" height="24" rx="5" fill={accent} fillOpacity="0.22" stroke={accent} strokeWidth="1.2" />
      <rect x="45" y="30" width="10" height="24" rx="5" fill={accent} fillOpacity="0.22" stroke={accent} strokeWidth="1.2" />

      <rect x="14" y="26" width="32" height="30" rx="8" fill={accent} fillOpacity="0.22" stroke={accent} strokeWidth="1.2" />

      <g transform="translate(23, 34) scale(0.58)" opacity="0.85">
        {s.paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.fill ? accent : "none"}
            stroke={accent}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {mainParts.map((p, i) => (
        <HairShape key={`main-${i}`} part={p} accent={accent} />
      ))}

      <circle cx="30" cy="17" r="13" fill="var(--surface-2)" stroke={accent} strokeWidth="1.5" />
      <circle cx="25.5" cy="15" r="2.2" fill={accent} />
      <circle cx="34.5" cy="15" r="2.2" fill={accent} />
      <path d="M 26 21 Q 30 24.5 34 21" fill="none" stroke={accent} strokeWidth="1.3" strokeLinecap="round" />

      {frontParts.map((p, i) => (
        <HairShape key={`front-${i}`} part={p} accent={accent} />
      ))}
    </svg>
  );
}
