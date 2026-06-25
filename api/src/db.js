import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "data");
mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(join(dataDir, "attention.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS character (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    sigil      TEXT    NOT NULL,
    accent     TEXT    NOT NULL,
    level      INTEGER NOT NULL DEFAULT 1,
    xp         INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quest (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    kind         TEXT    NOT NULL,
    day          TEXT,
    done         INTEGER NOT NULL DEFAULT 0,
    xp           INTEGER NOT NULL,
    created_at   TEXT    NOT NULL,
    completed_at TEXT
  );
`);

try { db.exec("ALTER TABLE character ADD COLUMN gold INTEGER NOT NULL DEFAULT 0"); } catch (_) {}
try { db.exec("ALTER TABLE character ADD COLUMN sex TEXT NOT NULL DEFAULT 'M'"); } catch (_) {}
try { db.exec("ALTER TABLE character ADD COLUMN hair TEXT NOT NULL DEFAULT 'curto'"); } catch (_) {}

export const DAILY_XP = 25;
export const AVULSA_XP = 60;
export const DAILY_GOLD = 10;
export const AVULSA_GOLD = 25;
export const MAX_DAILY = 3;

export function xpToNext(level) {
  return 100 * level;
}

export function today() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function toCharacter(row) {
  if (!row) return null;
  return {
    name: row.name,
    sigil: row.sigil,
    accent: row.accent,
    level: row.level,
    xp: row.xp,
    gold: row.gold ?? 0,
    sex: row.sex ?? "M",
    hair: row.hair ?? "curto",
    createdAt: row.created_at,
  };
}

function characterRow() {
  return db.prepare("SELECT * FROM character ORDER BY id DESC LIMIT 1").get();
}

export function getCharacter() {
  return toCharacter(characterRow());
}

export function createCharacter({ name, sigil, accent, sex, hair }) {
  db.prepare(
    "INSERT INTO character (name, sigil, accent, level, xp, gold, sex, hair, created_at) VALUES (?, ?, ?, 1, 0, 0, ?, ?, ?)",
  ).run(name, sigil, accent, sex ?? "M", hair ?? "curto", new Date().toISOString());
  return getCharacter();
}

export function resetCharacter() {
  db.exec("DELETE FROM character; DELETE FROM quest;");
}

function awardXp(xpGain, kind) {
  const row = characterRow();
  if (!row) return { character: null, leveledUp: false, gained: 0 };

  const before = row.level;
  let { level, xp } = row;
  const gold = (row.gold ?? 0) + (kind === "daily" ? DAILY_GOLD : AVULSA_GOLD);
  xp += xpGain;
  while (xp >= xpToNext(level)) {
    xp -= xpToNext(level);
    level += 1;
  }
  db.prepare("UPDATE character SET level = ?, xp = ?, gold = ? WHERE id = ?").run(
    level,
    xp,
    gold,
    row.id,
  );
  return { character: getCharacter(), leveledUp: level > before, gained: xpGain };
}

function toQuest(row) {
  return {
    id: row.id,
    title: row.title,
    kind: row.kind,
    day: row.day,
    done: !!row.done,
    xp: row.xp,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export function listQuests() {
  const d = today();
  const daily = db
    .prepare(
      "SELECT * FROM quest WHERE kind = 'daily' AND day = ? ORDER BY id ASC",
    )
    .all(d)
    .map(toQuest);
  const avulsas = db
    .prepare("SELECT * FROM quest WHERE kind = 'avulsa' ORDER BY done ASC, id DESC")
    .all()
    .map(toQuest);
  return { today: d, daily, avulsas };
}

export function createQuest({ title, kind }) {
  if (kind !== "daily" && kind !== "avulsa") {
    throw Object.assign(new Error("Tipo de quest invalido."), { status: 400 });
  }
  const d = today();
  if (kind === "daily") {
    const count = db
      .prepare("SELECT COUNT(*) AS n FROM quest WHERE kind = 'daily' AND day = ?")
      .get(d).n;
    if (count >= MAX_DAILY) {
      throw Object.assign(
        new Error(`Voce ja tem ${MAX_DAILY} quests para hoje.`),
        { status: 409 },
      );
    }
  }
  const xp = kind === "daily" ? DAILY_XP : AVULSA_XP;
  const info = db
    .prepare(
      "INSERT INTO quest (title, kind, day, done, xp, created_at) VALUES (?, ?, ?, 0, ?, ?)",
    )
    .run(title, kind, kind === "daily" ? d : null, xp, new Date().toISOString());
  return toQuest(
    db.prepare("SELECT * FROM quest WHERE id = ?").get(info.lastInsertRowid),
  );
}

export function completeQuest(id) {
  const row = db.prepare("SELECT * FROM quest WHERE id = ?").get(id);
  if (!row) throw Object.assign(new Error("Quest nao encontrada."), { status: 404 });
  if (row.done) {
    return { quest: toQuest(row), character: getCharacter(), leveledUp: false, gained: 0 };
  }
  db.prepare("UPDATE quest SET done = 1, completed_at = ? WHERE id = ?").run(
    new Date().toISOString(),
    id,
  );
  const award = awardXp(row.xp, row.kind);
  const quest = toQuest(db.prepare("SELECT * FROM quest WHERE id = ?").get(id));
  return { quest, ...award };
}

export function deleteQuest(id) {
  const info = db.prepare("DELETE FROM quest WHERE id = ?").run(id);
  if (info.changes === 0) {
    throw Object.assign(new Error("Quest nao encontrada."), { status: 404 });
  }
}
