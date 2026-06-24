import { createServer } from "node:http";
import {
  completeQuest,
  createCharacter,
  createQuest,
  deleteQuest,
  getCharacter,
  listQuests,
  resetCharacter,
} from "./db.js";

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

      if (name.length < 2)
        return sendJson(res, 400, { error: "Nome precisa de ao menos 2 letras." });
      if (!sigil || !accent)
        return sendJson(res, 400, { error: "Sigilo e cor sao obrigatorios." });
      if (getCharacter())
        return sendJson(res, 409, { error: "Ja existe um heroi. Reset antes." });

      return sendJson(res, 201, { character: createCharacter({ name, sigil, accent }) });
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

    const complete = path.match(/^\/api\/quests\/(\d+)\/complete$/);
    if (complete && method === "POST") {
      return sendJson(res, 200, completeQuest(Number(complete[1])));
    }

    const single = path.match(/^\/api\/quests\/(\d+)$/);
    if (single && method === "DELETE") {
      deleteQuest(Number(single[1]));
      return sendJson(res, 200, { ok: true });
    }

    sendJson(res, 404, { error: "Rota nao encontrada." });
  } catch (err) {
    sendJson(res, err.status ?? 500, { error: err.message ?? "Erro interno." });
  }
});

server.listen(PORT, () => {
  console.log(`attention! api em http://localhost:${PORT}`);
});
