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
  head: string | null;
  face: string | null;
  ears: string | null;
  neck: string | null;
  ownedItems: string[];
  assistant: string;
  ownedAssistants: string[];
  companion: string | null;
  ownedCompanions: string[];
  createdAt: string;
};

export type Screen = "home" | "pergaminho" | "casa" | "loja" | "taverna";
export type ShopSlot = "torso" | "legs" | "feet" | "head" | "face" | "ears" | "neck";

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

export type Note = {
  id: number;
  title: string;
  body: string;
  done: boolean;
  createdAt: string;
  doneAt: string | null;
};

export type RememberResult = {
  note: Note;
  character: Character;
  gained: number;
};

export type CompleteResult = {
  quest: Quest;
  character: Character;
  leveledUp: boolean;
  gained: number;
};
