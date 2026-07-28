import type {
  Character,
  CharacterInput,
  CompleteResult,
  Note,
  Quest,
  QuestKind,
  QuestsState,
  RememberResult,
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

export async function suggestQuests(text: string): Promise<string[]> {
  const data = await parse(
    await fetch("/api/quests/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }),
  );
  return data.suggestions ?? [];
}

export async function completeQuest(id: number): Promise<CompleteResult> {
  return parse(
    await fetch(`/api/quests/${id}/complete`, { method: "POST" }),
  );
}

export async function removeQuest(id: number): Promise<void> {
  await parse(await fetch(`/api/quests/${id}`, { method: "DELETE" }));
}

export async function fetchNotes(): Promise<Note[]> {
  const data = await parse(await fetch("/api/notes"));
  return data.notes ?? [];
}

export async function addNote(input: { title: string; body: string }): Promise<Note> {
  const data = await parse(
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
  return data.note;
}

export async function rememberNote(id: number): Promise<RememberResult> {
  return parse(await fetch(`/api/notes/${id}/remember`, { method: "POST" }));
}

export async function removeNote(id: number): Promise<void> {
  await parse(await fetch(`/api/notes/${id}`, { method: "DELETE" }));
}

export async function buyItem(itemId: string, price: number, itemPath: string): Promise<Character> {
  const data = await parse(
    await fetch("/api/shop/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, price, itemPath }),
    }),
  );
  return data.character;
}

export async function equipItem(itemPath: string, slot: string): Promise<Character> {
  const data = await parse(
    await fetch("/api/character/equip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemPath, slot }),
    }),
  );
  return data.character;
}

export async function unequipSlot(slot: string): Promise<Character> {
  const data = await parse(
    await fetch("/api/character/unequip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot }),
    }),
  );
  return data.character;
}

export async function buyAssistant(assistantId: string, price: number): Promise<Character> {
  const data = await parse(
    await fetch("/api/assistants/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantId, price }),
    }),
  );
  return data.character;
}

export async function equipAssistant(assistantId: string): Promise<Character> {
  const data = await parse(
    await fetch("/api/assistants/equip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantId }),
    }),
  );
  return data.character;
}
