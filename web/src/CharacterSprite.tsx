import { CharacterCanvas } from "./CharacterCanvas.tsx";
import { buildLayers } from "./data.ts";

type Props = {
  sex?: "M" | "F";
  skin?: string;
  hair?: string;
  hairColor?: string;
  torso?: string;
  legs?: string;
  feet?: string;
  size?: number;
};

export function CharacterSprite({
  sex = "M",
  skin = "light",
  hair = "plain",
  hairColor = "brown",
  torso,
  legs,
  feet,
  size = 192,
}: Props) {
  const layers = buildLayers({ sex, skin, hair, hairColor, torso, legs, feet });
  return <CharacterCanvas layers={layers} size={size} />;
}
