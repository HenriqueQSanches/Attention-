export type Character = {
  name: string;
  sigil: string;
  accent: string;
  level: number;
  xp: number;
  gold: number;
  sex: "M" | "F";
  skin: string;
  hair: string;
  hairColor: string;
  torso: string | null;
  legs: string | null;
  feet: string | null;
  ownedItems: string[];
  assistant: string;
  ownedAssistants: string[];
  createdAt: string;
};

export type Screen = "home" | "casa" | "loja" | "taverna";
export type ShopSlot = "torso" | "legs" | "feet";

export type CharacterInput = {
  name: string;
  sigil: string;
  accent: string;
  sex: "M" | "F";
  skin: string;
  hair: string;
  hairColor: string;
  torso: string | null;
  legs: string | null;
  feet: string | null;
};

export type QuestKind = "daily" | "avulsa";

export type Quest = {
  id: number;
  title: string;
  kind: QuestKind;
  day: string | null;
  done: boolean;
  xp: number;
  createdAt: string;
  completedAt: string | null;
};

export type QuestsState = {
  today: string;
  daily: Quest[];
  avulsas: Quest[];
};

export type CompleteResult = {
  quest: Quest;
  character: Character;
  leveledUp: boolean;
  gained: number;
};
