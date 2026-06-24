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

export function sigilById(id: string): Sigil {
  return SIGILS.find((s) => s.id === id) ?? SIGILS[0];
}

export function xpToNext(level: number): number {
  return 100 * level;
}
