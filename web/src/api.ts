import type {
  Character,
  CharacterInput,
  CompleteResult,
  Quest,
  QuestKind,
  QuestsState,
} from "./types.ts";

async function parse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Falha na comunicação com a API.");
  return data;
}

export async function fetchCharacter(): Promise<Character | null> {
  const data = await parse(await fetch("/api/character"));
  return data.character ?? null;
}

export async function saveCharacter(input: CharacterInput): Promise<Character> {
  const data = await parse(
    await fetch("/api/character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
  return data.character;
}

export async function resetCharacter(): Promise<void> {
  await parse(await fetch("/api/character", { method: "DELETE" }));
}

export async function fetchQuests(): Promise<QuestsState> {
  return parse(await fetch("/api/quests"));
}

export async function addQuest(input: {
  title: string;
  kind: QuestKind;
}): Promise<Quest> {
  const data = await parse(
    await fetch("/api/quests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
  return data.quest;
}

export async function completeQuest(id: number): Promise<CompleteResult> {
  return parse(
    await fetch(`/api/quests/${id}/complete`, { method: "POST" }),
  );
}

export async function removeQuest(id: number): Promise<void> {
  await parse(await fetch(`/api/quests/${id}`, { method: "DELETE" }));
}
