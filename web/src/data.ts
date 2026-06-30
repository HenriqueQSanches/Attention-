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
  { id: "indigo",  hex: "#6366f1", label: "Indigo" },
  { id: "teal",    hex: "#14b8a6", label: "Teal" },
  { id: "ambar",   hex: "#d99a2b", label: "Ambar" },
  { id: "carmim",  hex: "#d6455d", label: "Carmim" },
  { id: "violeta", hex: "#a371f7", label: "Violeta" },
  { id: "aco",     hex: "#5b8def", label: "Aço" },
];

// ── Skin tones ──────────────────────────────────────────────────────────
export type SkinTone = { id: string; label: string; hex: string };
export const SKIN_TONES: SkinTone[] = [
  { id: "light",  label: "Clara",   hex: "#ffe0bd" },
  { id: "tanned", label: "Morena",  hex: "#c68642" },
  { id: "dark",   label: "Negra",   hex: "#5c3317" },
];

// ── Hair ─────────────────────────────────────────────────────────────────
export type HairStyle = { id: string; label: string };
export type HairColor = { id: string; label: string; hex: string };

export const MALE_HAIRS: HairStyle[] = [
  { id: "plain",  label: "Liso"     },
  { id: "bangs",  label: "Franja"   },
  { id: "messy1", label: "Bagunçado"},
  { id: "long",   label: "Longo"    },
  { id: "mohawk", label: "Moicano"  },
];

export const FEMALE_HAIRS: HairStyle[] = [
  { id: "plain",    label: "Liso"     },
  { id: "bangs",    label: "Franja"   },
  { id: "messy1",   label: "Bagunçado"},
  { id: "long",     label: "Longo"    },
  { id: "ponytail", label: "Rabo"     },
];

export const HAIR_COLORS: HairColor[] = [
  { id: "black",  label: "Preto",  hex: "#1a1a1a" },
  { id: "brown",  label: "Castanho", hex: "#8b4513" },
  { id: "blonde", label: "Loiro",  hex: "#d4a017" },
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

// ── Monta as camadas LPC do personagem ──────────────────────────────────
export function buildLayers(opts: {
  sex: "M" | "F";
  skin: string;
  hair: string;
  hairColor: string;
  torso?: string;
  legs?: string;
  feet?: string;
}): string[] {
  const g = opts.sex === "M" ? "male" : "female";
  const layers: string[] = [
    `/sprites/body/${g}/${opts.skin}.png`,
    `/sprites/hair/${g}/${opts.hair}/${opts.hairColor}.png`,
  ];
  if (opts.torso) layers.splice(1, 0, `/sprites/${opts.torso}`);
  if (opts.legs)  layers.splice(layers.length - 1, 0, `/sprites/${opts.legs}`);
  if (opts.feet)  layers.push(`/sprites/${opts.feet}`);
  return layers;
}

// ── Catálogo da loja ──────────────────────────────────────────────────────
export type ShopSlot = "torso" | "legs" | "feet";
export type ShopItem = {
  id: string;
  label: string;
  slot: ShopSlot;
  price: number;
  path: string;       // relativo a /sprites/
  sexes: ("M" | "F")[];
  tier: "common" | "rare" | "epic";
};

export const SHOP_ITEMS: ShopItem[] = [
  // ── torso
  { id: "shirt_white",  label: "Camisa Branca",    slot: "torso", price: 50,  path: "torso/shirts/male/white.png",  sexes: ["M"], tier: "common" },
  { id: "shirt_brown",  label: "Camisa Marrom",    slot: "torso", price: 50,  path: "torso/shirts/male/brown.png",  sexes: ["M"], tier: "common" },
  { id: "shirt_teal",   label: "Camisa Teal",      slot: "torso", price: 75,  path: "torso/shirts/male/teal.png",   sexes: ["M"], tier: "common" },
  { id: "shirt_maroon", label: "Camisa Vinho",     slot: "torso", price: 75,  path: "torso/shirts/male/maroon.png", sexes: ["M"], tier: "common" },
  { id: "leather",      label: "Colete de Couro",  slot: "torso", price: 200, path: "torso/leather/chest_male.png", sexes: ["M"], tier: "rare"   },
  { id: "plate",        label: "Peitoral de Placa", slot: "torso", price: 500, path: "torso/plate/chest_male.png",  sexes: ["M"], tier: "epic"   },

  // ── legs
  { id: "pants_white",   label: "Calça Branca",   slot: "legs", price: 50,  path: "legs/pants/male/white.png",   sexes: ["M"], tier: "common" },
  { id: "pants_teal",    label: "Calça Teal",     slot: "legs", price: 75,  path: "legs/pants/male/teal.png",    sexes: ["M"], tier: "common" },
  { id: "pants_magenta", label: "Calça Magenta",  slot: "legs", price: 75,  path: "legs/pants/male/magenta.png", sexes: ["M"], tier: "rare"   },

  // ── feet
  { id: "shoes_black", label: "Botas Pretas",  slot: "feet", price: 60,  path: "feet/shoes/male/black.png", sexes: ["M", "F"], tier: "common" },
  { id: "shoes_brown", label: "Botas Marrons", slot: "feet", price: 60,  path: "feet/shoes/male/brown.png", sexes: ["M", "F"], tier: "common" },
];

export const TIER_LABEL: Record<string, string> = {
  common: "Comum",
  rare:   "Raro",
  epic:   "Épico",
};
