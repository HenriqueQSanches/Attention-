export type Character = {
  name: string;
  sigil: string;
  accent: string;
  level: number;
  xp: number;
  createdAt: string;
};

export type CharacterInput = {
  name: string;
  sigil: string;
  accent: string;
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
