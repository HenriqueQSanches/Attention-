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
  head?: string;
  face?: string;
  ears?: string;
  neck?: string;
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
  head,
  face,
  ears,
  neck,
  size = 192,
}: Props) {
  const layers = buildLayers({ sex, skin, hair, hairColor, torso, legs, feet, head, face, ears, neck });
  return <CharacterCanvas layers={layers} size={size} />;
}
