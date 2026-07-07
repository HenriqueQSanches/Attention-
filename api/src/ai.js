const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `Você é o mascote-companheiro do "attention!", um RPG de foco para gente que trava diante de tarefas grandes.
O herói te entrega UMA missão grande, vaga ou intimidante. Você a corta em passos pequenos e possíveis.
Regras:
- Entre 2 e 6 passos. Menos é melhor que mais.
- Cada passo começa com um verbo no infinitivo e descreve UMA ação com um "pronto" claro e verificável.
- No máximo 70 caracteres por passo. O passo vira um item de checklist: prático e concreto, sem enrolação, sem numerar, sem sub-itens.
- Tom leve, de aliado que torce por você, nunca de professor cobrando. A leveza fica na escolha das palavras, mas a ação continua clara.
- Português do Brasil.
- Responda SOMENTE com JSON no formato {"subtarefas": ["...", "..."]}.`;

export async function suggestQuests(text) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw Object.assign(new Error("A chave da IA nao esta configurada no servidor."), { status: 503 });
  }

  let res;
  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: text },
        ],
      }),
    });
  } catch {
    throw Object.assign(new Error("Nao consegui falar com a IA. Verifique a conexao."), { status: 502 });
  }

  if (!res.ok) {
    throw Object.assign(new Error(`A IA recusou o pedido (${res.status}).`), { status: 502 });
  }

  const data = await res.json().catch(() => ({}));
  const content = data?.choices?.[0]?.message?.content ?? "";
  return parseSubtasks(content);
}

function parseSubtasks(content) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return [];
  }
  const raw = Array.isArray(parsed)
    ? parsed
    : parsed.subtarefas ?? parsed.subtasks ?? parsed.quests ?? [];
  if (!Array.isArray(raw)) return [];

  const seen = new Set();
  const out = [];
  for (const item of raw) {
    const s = String(item ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
    if (s.length < 3) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= 6) break;
  }
  return out;
}
