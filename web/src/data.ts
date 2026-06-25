export type Sigil = {
  id: string;
  label: string;
  paths: { d: string; fill?: boolean }[];
};

export const SIGILS: Sigil[] = [
  {
    id: "lente",
    label: "Lente",
    paths: [
      { d: "M12 4 L12 8 M12 16 L12 20 M4 12 L8 12 M16 12 L20 12" },
      { d: "M12 8.5 a3.5 3.5 0 1 0 0.01 0" },
    ],
  },
  {
    id: "raio",
    label: "Raio",
    paths: [{ d: "M13 3 L6 13 L11 13 L10 21 L18 10 L13 10 Z", fill: true }],
  },
  {
    id: "cristal",
    label: "Cristal",
    paths: [{ d: "M12 3 L19 9 L12 21 L5 9 Z" }, { d: "M5 9 L19 9 M12 3 L12 21" }],
  },
  {
    id: "bussola",
    label: "Bussola",
    paths: [
      { d: "M12 3 a9 9 0 1 0 0.01 0" },
      { d: "M12 7 L14 12 L12 17 L10 12 Z", fill: true },
    ],
  },
  {
    id: "chama",
    label: "Chama",
    paths: [
      { d: "M12 3 C16 8 17 11 14 15 C16 14 16 11 16 11 C18 16 15 21 12 21 C9 21 6 18 7 14 C8 16 9 16 9 16 C7 12 10 7 12 3 Z" },
    ],
  },
  {
    id: "norte",
    label: "Norte",
    paths: [
      { d: "M12 3 L15 12 L12 11 L9 12 Z", fill: true },
      { d: "M12 13 L13 21 L12 20 L11 21 Z" },
    ],
  },
];

export const ACCENTS: { id: string; hex: string; label: string }[] = [
  { id: "indigo", hex: "#6366f1", label: "Indigo" },
  { id: "teal", hex: "#14b8a6", label: "Teal" },
  { id: "ambar", hex: "#d99a2b", label: "Ambar" },
  { id: "carmim", hex: "#d6455d", label: "Carmim" },
  { id: "violeta", hex: "#a371f7", label: "Violeta" },
  { id: "aco", hex: "#5b8def", label: "Aco" },
];

export type HairPart = {
  layer: "back" | "main" | "front";
  d?: string;
  cx?: number;
  cy?: number;
  r?: number;
};

export type HairStyle = {
  id: string;
  label: string;
  parts: HairPart[];
};

export const MALE_HAIRS: HairStyle[] = [
  {
    id: "careca",
    label: "Careca",
    parts: [],
  },
  {
    id: "curto",
    label: "Curto",
    parts: [
      {
        layer: "main",
        d: "M 18 17 A 12 12 0 0 1 42 17 C 41 8 36 3 30 3 C 24 3 19 8 18 17 Z",
      },
    ],
  },
  {
    id: "medio",
    label: "Médio",
    parts: [
      {
        layer: "main",
        d: "M 16 18 A 14 14 0 0 1 44 18 C 44 7 38 1 30 1 C 22 1 16 7 16 18 Z",
      },
    ],
  },
  {
    id: "crespo",
    label: "Crespo",
    parts: [
      {
        layer: "main",
        d: "M 14 19 C 11 13 12 5 16 3 C 18 1 21 3 22 6 C 24 2 27 0 30 1 C 33 0 36 2 38 6 C 39 3 42 1 44 3 C 48 5 49 13 46 19 Z",
      },
    ],
  },
];

export const FEMALE_HAIRS: HairStyle[] = [
  {
    id: "curto_f",
    label: "Curto",
    parts: [
      {
        layer: "main",
        d: "M 13 21 A 16 16 0 0 1 47 21 L 47 32 C 47 38 43 39 39 37 C 36 39 30 40 30 40 C 24 40 21 39 18 37 C 14 39 13 38 13 32 Z",
      },
    ],
  },
  {
    id: "medio_f",
    label: "Médio",
    parts: [
      {
        layer: "back",
        d: "M 12 22 A 17 17 0 0 1 48 22 L 51 47 C 51 54 46 55 41 52 L 19 52 C 14 55 9 54 9 47 Z",
      },
    ],
  },
  {
    id: "longo",
    label: "Longo",
    parts: [
      {
        layer: "back",
        d: "M 12 22 A 17 17 0 0 1 48 22 L 52 70 C 50 78 44 79 40 75 L 20 75 C 16 79 10 78 8 70 Z",
      },
    ],
  },
  {
    id: "coque",
    label: "Coque",
    parts: [
      {
        layer: "main",
        d: "M 14 20 A 14 14 0 0 1 46 20 C 46 10 40 4 33 4 C 31 3 29 3 27 4 C 20 4 14 10 14 20 Z",
      },
      { layer: "front", cx: 30, cy: 7, r: 7 },
    ],
  },
];

export function hairsBySex(sex: "M" | "F"): HairStyle[] {
  return sex === "M" ? MALE_HAIRS : FEMALE_HAIRS;
}

export function sigilById(id: string): Sigil {
  return SIGILS.find((s) => s.id === id) ?? SIGILS[0];
}

export function xpToNext(level: number): number {
  return 100 * level;
}
