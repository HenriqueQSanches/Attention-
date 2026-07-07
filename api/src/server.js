import { createServer } from "node:http";
import {
  buyItem,
  buyPet,
  completeQuest,
  createCharacter,
  createQuest,
  deleteQuest,
  equipItem,
  equipPet,
  getCharacter,
  listQuests,
  resetCharacter,
  unequipSlot,
} from "./db.js";
import { suggestQuests } from "./ai.js";

const PORT = 3333;

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(data),
  });
  res.end(data);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 1e6) req.destroy();
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error("JSON invalido."), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const { method } = req;
  const path = new URL(req.url, `http://localhost:${PORT}`).pathname;

  try {
    if (path === "/api/character" && method === "GET") {
      return sendJson(res, 200, { character: getCharacter() });
    }

    if (path === "/api/character" && method === "POST") {
      const body = await readJson(req);
      const name = String(body.name ?? "").trim();
      const sigil = String(body.sigil ?? "").trim();
      const accent = String(body.accent ?? "").trim();
      const sex       = body.sex === "F" ? "F" : "M";
      const skin      = ["light","tanned","dark"].includes(body.skin) ? body.skin : "light";
      const hair      = String(body.hair ?? "").trim() || "plain";
      const hairColor = String(body.hairColor ?? "").trim() || "brown";
      const torso     = body.torso ? String(body.torso).trim() : null;
      const legs      = body.legs ? String(body.legs).trim() : null;
      const feet      = body.feet ? String(body.feet).trim() : null;

      if (name.length < 2)
        return sendJson(res, 400, { error: "Nome precisa de ao menos 2 letras." });
      if (!sigil || !accent)
        return sendJson(res, 400, { error: "Sigilo e cor sao obrigatorios." });
      if (getCharacter())
        return sendJson(res, 409, { error: "Ja existe um heroi. Reset antes." });

      return sendJson(res, 201, { character: createCharacter({ name, sigil, accent, sex, skin, hair, hairColor, torso, legs, feet }) });
    }

    if (path === "/api/character" && method === "DELETE") {
      resetCharacter();
      return sendJson(res, 200, { ok: true });
    }

    if (path === "/api/quests" && method === "GET") {
      return sendJson(res, 200, listQuests());
    }

    if (path === "/api/quests" && method === "POST") {
      const body = await readJson(req);
      const title = String(body.title ?? "").trim();
      const kind = String(body.kind ?? "").trim();
      if (title.length < 3)
        return sendJson(res, 400, { error: "Descreva a quest (min. 3 letras)." });
      return sendJson(res, 201, { quest: createQuest({ title, kind }) });
    }

    if (path === "/api/quests/suggest" && method === "POST") {
      const body = await readJson(req);
      const text = String(body.text ?? "").trim();
      if (text.length < 4)
        return sendJson(res, 400, { error: "Descreva a tarefa (min. 4 letras)." });
      return sendJson(res, 200, { suggestions: await suggestQuests(text) });
    }

    const complete = path.match(/^\/api\/quests\/(\d+)\/complete$/);
    if (complete && method === "POST") {
      return sendJson(res, 200, completeQuest(Number(complete[1])));
    }

    const single = path.match(/^\/api\/quests\/(\d+)$/);
    if (single && method === "DELETE") {
      deleteQuest(Number(single[1]));
      return sendJson(res, 200, { ok: true });
    }

    // ── Loja: comprar item ──────────────────────────────────────────────
    if (path === "/api/shop/buy" && method === "POST") {
      const body = await readJson(req);
      const { itemId, price, itemPath } = body;
      if (!itemId || price == null || !itemPath)
        return sendJson(res, 400, { error: "itemId, price e itemPath sao obrigatorios." });
      return sendJson(res, 200, { character: buyItem(itemId, price, itemPath) });
    }

    // ── Equipar / desequipar slot ───────────────────────────────────────
    if (path === "/api/character/equip" && method === "POST") {
      const body = await readJson(req);
      const { itemPath, slot } = body;
      const VALID_SLOTS = ["torso", "legs", "feet"];
      if (!itemPath || !VALID_SLOTS.includes(slot))
        return sendJson(res, 400, { error: "itemPath e slot valido sao obrigatorios." });
      return sendJson(res, 200, { character: equipItem(itemPath, slot) });
    }

    if (path === "/api/character/unequip" && method === "POST") {
      const body = await readJson(req);
      const { slot } = body;
      const VALID_SLOTS = ["torso", "legs", "feet"];
      if (!VALID_SLOTS.includes(slot))
        return sendJson(res, 400, { error: "Slot invalido." });
      return sendJson(res, 200, { character: unequipSlot(slot) });
    }

    // ── Pets: adotar / equipar ──────────────────────────────────────────
    if (path === "/api/pets/buy" && method === "POST") {
      const body = await readJson(req);
      const petId = String(body.petId ?? "").trim();
      const price = Number(body.price);
      if (!petId || !Number.isFinite(price) || price < 0)
        return sendJson(res, 400, { error: "petId e price validos sao obrigatorios." });
      return sendJson(res, 200, { character: buyPet(petId, price) });
    }

    if (path === "/api/pets/equip" && method === "POST") {
      const body = await readJson(req);
      const petId = String(body.petId ?? "").trim();
      if (!petId)
        return sendJson(res, 400, { error: "petId e obrigatorio." });
      return sendJson(res, 200, { character: equipPet(petId) });
    }

    sendJson(res, 404, { error: "Rota nao encontrada." });
  } catch (err) {
    sendJson(res, err.status ?? 500, { error: err.message ?? "Erro interno." });
  }
});

server.listen(PORT, () => {
  console.log(`attention! api em http://localhost:${PORT}`);
});
