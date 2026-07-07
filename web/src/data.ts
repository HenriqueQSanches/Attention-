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
  { id: "plain",  label: "Liso"       },
  { id: "bangs",  label: "Franja"     },
  { id: "messy1", label: "Bagunçado"  },
  { id: "messy2", label: "Bagunçado 2"},
  { id: "long",   label: "Longo"      },
  { id: "mohawk", label: "Moicano"    },
  { id: "spiked", label: "Espetado"   },
  { id: "bedhead",label: "Despenteado"},
  { id: "swoop",  label: "Topete"     },
  { id: "mop",    label: "Cabeludo"   },
];

export const FEMALE_HAIRS: HairStyle[] = [
  { id: "plain",         label: "Liso"      },
  { id: "bangs",         label: "Franja"    },
  { id: "messy1",        label: "Bagunçado" },
  { id: "long",          label: "Longo"     },
  { id: "ponytail",      label: "Rabo"      },
  { id: "braid",         label: "Trança"    },
  { id: "curly_long",    label: "Cachos"    },
  { id: "wavy",          label: "Ondulado"  },
  { id: "pigtails",      label: "Chiquinhas"},
  { id: "high_ponytail", label: "Rabo Alto" },
  { id: "princess",      label: "Princesa"  },
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

  // ── Feminino: vestidos, blusas, calças, sapatos
  { id: "fdb_teal",   label: "Vestido Verde-água",      slot: "torso", price: 190, path: "torso/dress_bodice/female/teal.png",   sexes: ["F"], tier: "rare"   },
  { id: "fdb_purple", label: "Vestido Roxo",            slot: "torso", price: 190, path: "torso/dress_bodice/female/purple.png", sexes: ["F"], tier: "rare"   },
  { id: "fdb_rose",   label: "Vestido Rosé",            slot: "torso", price: 190, path: "torso/dress_bodice/female/rose.png",   sexes: ["F"], tier: "rare"   },
  { id: "fdb_navy",   label: "Vestido Marinho",         slot: "torso", price: 190, path: "torso/dress_bodice/female/navy.png",   sexes: ["F"], tier: "rare"   },
  { id: "fds_red",    label: "Vestido Fenda Vermelho",  slot: "torso", price: 280, path: "torso/dress_slit/female/red.png",      sexes: ["F"], tier: "epic"   },
  { id: "fds_forest", label: "Vestido Fenda Musgo",     slot: "torso", price: 280, path: "torso/dress_slit/female/forest.png",   sexes: ["F"], tier: "epic"   },
  { id: "fbl_white",  label: "Blusa Branca",            slot: "torso", price: 80,  path: "torso/blouse/female/white.png",        sexes: ["F"], tier: "common" },
  { id: "fbl_teal",   label: "Blusa Verde-água",        slot: "torso", price: 80,  path: "torso/blouse/female/teal.png",         sexes: ["F"], tier: "common" },
  { id: "fbl_rose",   label: "Blusa Rosé",              slot: "torso", price: 80,  path: "torso/blouse/female/rose.png",         sexes: ["F"], tier: "common" },
  { id: "fbl_maroon", label: "Blusa Vinho",             slot: "torso", price: 80,  path: "torso/blouse/female/maroon.png",       sexes: ["F"], tier: "common" },
  { id: "fbl_navy",   label: "Blusa Marinho",           slot: "torso", price: 80,  path: "torso/blouse/female/navy.png",         sexes: ["F"], tier: "common" },
  { id: "fpa_black",  label: "Calça Preta",             slot: "legs",  price: 70,  path: "legs/pants/female/black.png",          sexes: ["F"], tier: "common" },
  { id: "fpa_navy",   label: "Calça Marinho",           slot: "legs",  price: 70,  path: "legs/pants/female/navy.png",           sexes: ["F"], tier: "common" },
  { id: "fpa_maroon", label: "Calça Vinho",             slot: "legs",  price: 70,  path: "legs/pants/female/maroon.png",         sexes: ["F"], tier: "common" },
  { id: "fpa_teal",   label: "Calça Verde-água",        slot: "legs",  price: 70,  path: "legs/pants/female/teal.png",           sexes: ["F"], tier: "common" },
  { id: "fsh_black",  label: "Sapatos Pretos",          slot: "feet",  price: 60,  path: "feet/shoes/female/black.png",          sexes: ["F"], tier: "common" },
  { id: "fsh_brown",  label: "Sapatos Marrons",         slot: "feet",  price: 60,  path: "feet/shoes/female/brown.png",          sexes: ["F"], tier: "common" },
  { id: "fsh_red",    label: "Sapatos Vermelhos",       slot: "feet",  price: 60,  path: "feet/shoes/female/red.png",            sexes: ["F"], tier: "common" },
  { id: "fsh_white",  label: "Sapatos Brancos",         slot: "feet",  price: 60,  path: "feet/shoes/female/white.png",          sexes: ["F"], tier: "common" },

  // ── Masculino: camisas, coletes, calças, sapatos
  { id: "mls_white",    label: "Camisa Branca",   slot: "torso", price: 80,  path: "torso/longsleeve/male/white.png",    sexes: ["M"], tier: "common" },
  { id: "mls_navy",     label: "Camisa Marinho",  slot: "torso", price: 80,  path: "torso/longsleeve/male/navy.png",     sexes: ["M"], tier: "common" },
  { id: "mls_forest",   label: "Camisa Musgo",    slot: "torso", price: 80,  path: "torso/longsleeve/male/forest.png",   sexes: ["M"], tier: "common" },
  { id: "mls_charcoal", label: "Camisa Grafite",  slot: "torso", price: 80,  path: "torso/longsleeve/male/charcoal.png", sexes: ["M"], tier: "common" },
  { id: "mls_maroon",   label: "Camisa Vinho",    slot: "torso", price: 80,  path: "torso/longsleeve/male/maroon.png",   sexes: ["M"], tier: "common" },
  { id: "mvs_black",    label: "Colete Preto",    slot: "torso", price: 160, path: "torso/vest/male/black.png",          sexes: ["M"], tier: "rare"   },
  { id: "mvs_brown",    label: "Colete Marrom",   slot: "torso", price: 160, path: "torso/vest/male/brown.png",          sexes: ["M"], tier: "rare"   },
  { id: "mpa_black",    label: "Calça Preta",     slot: "legs",  price: 70,  path: "legs/pants/male/black.png",           sexes: ["M"], tier: "common" },
  { id: "mpa_brown",    label: "Calça Marrom",    slot: "legs",  price: 70,  path: "legs/pants/male/brown.png",           sexes: ["M"], tier: "common" },
  { id: "mpa_navy",     label: "Calça Marinho",   slot: "legs",  price: 70,  path: "legs/pants/male/navy.png",            sexes: ["M"], tier: "common" },
  { id: "mpa_forest",   label: "Calça Musgo",     slot: "legs",  price: 70,  path: "legs/pants/male/forest.png",          sexes: ["M"], tier: "common" },
  { id: "mfe_navy",     label: "Sapatos Marinho", slot: "feet",  price: 60,  path: "feet/shoes/male/navy.png",            sexes: ["M"], tier: "common" },
  { id: "mfe_red",      label: "Sapatos Vermelhos",slot: "feet", price: 60,  path: "feet/shoes/male/red.png",             sexes: ["M"], tier: "common" },
  { id: "mfe_white",    label: "Sapatos Brancos", slot: "feet",  price: 60,  path: "feet/shoes/male/white.png",           sexes: ["M"], tier: "common" },
];

// ── Roupa inicial na criação (o herói/heroína nasce vestido) ─────────────
export type Outfit = {
  id: string;
  label: string;
  torso: string | null;
  legs: string | null;
  feet: string | null;
};

export const STARTER_OUTFITS: Record<"M" | "F", Outfit[]> = {
  M: [
    { id: "m_casual",   label: "Casual",   torso: "torso/longsleeve/male/white.png", legs: "legs/pants/male/black.png",  feet: "feet/shoes/male/black.png" },
    { id: "m_classico", label: "Clássico", torso: "torso/longsleeve/male/navy.png",  legs: "legs/pants/male/brown.png",  feet: "feet/shoes/male/brown.png" },
    { id: "m_aventura", label: "Aventura", torso: "torso/longsleeve/male/forest.png", legs: "legs/pants/male/forest.png", feet: "feet/shoes/male/navy.png"  },
  ],
  F: [
    { id: "f_casual",  label: "Casual",  torso: "torso/blouse/female/white.png",      legs: "legs/pants/female/black.png",  feet: "feet/shoes/female/black.png" },
    { id: "f_vestido", label: "Vestido", torso: "torso/dress_bodice/female/teal.png", legs: null,                           feet: "feet/shoes/female/black.png" },
    { id: "f_rose",    label: "Rosé",    torso: "torso/blouse/female/rose.png",       legs: "legs/pants/female/maroon.png", feet: "feet/shoes/female/red.png"   },
  ],
};

export const TIER_LABEL: Record<string, string> = {
  common: "Comum",
  rare:   "Raro",
  epic:   "Épico",
};

// ── Arautos (aparências da Iris, a assistente que destrincha tarefas) ─────
export type Assistant = {
  id: string;
  name: string;
  seed: string;   // semente do DiceBear (estilo bottts)
  price: number;  // 0 = inicial, já vem desbloqueado
  tier: "common" | "rare" | "epic";
  line: string;   // fala do arauto na forja de quests
  opts?: Record<string, unknown>; // opções fixas do DiceBear (traços do rosto/cor)
};

export const ASSISTANTS: Assistant[] = [
  { id: "bolt",  name: "Iris",  seed: "iris-aurora",        price: 0,   tier: "common", line: "Sou a Iris, tua parceira de sempre. Manda a missão grande que eu divido em passos possíveis.", opts: { baseColor: ["a78bfa"], eyes: ["happy"], mouth: ["smile01"], face: ["round01"] } },
  { id: "pip",   name: "Pip",   seed: "pip-spark-77",       price: 120, tier: "common", line: "Pip na área! Solta a tarefa cabeluda que eu pico ela pra você." },
  { id: "sil",   name: "Sil",   seed: "sil-circuit-42",     price: 120, tier: "common", line: "Aqui é a Sil. Me diz o bicho de sete cabeças e eu devolvo em pedacinhos." },
  { id: "gizmo", name: "Gizmo", seed: "gizmo-gear-13",      price: 260, tier: "rare",   line: "Gizmo pronto. Toda missão vira lista curta comigo no comando." },
  { id: "rue",   name: "Rue",   seed: "rue-signal-88",      price: 260, tier: "rare",   line: "Rue reportando. Nenhuma tarefa é grande demais depois que eu fatio." },
  { id: "vega",  name: "Vega",  seed: "vega-nova-09",       price: 550, tier: "epic",   line: "Sou a Vega. Traz o caos que eu organizo em passos limpos." },
  { id: "titan", name: "Titan", seed: "titan-core-01",      price: 550, tier: "epic",   line: "Titan em campo. Missões colossais são a minha especialidade." },
];

export function assistantById(id: string): Assistant {
  return ASSISTANTS.find((a) => a.id === id) ?? ASSISTANTS[0];
}
