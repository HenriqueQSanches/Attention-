# attention!

> A vida inteira mandaram você prestar atenção. O attention! é a primeira vez que a palavra está do seu lado.

Esse é um projeto pessoal que eu criei pra mim mesmo. Eu funciono muito melhor quando o dia está quebrado em pequenas tarefas claras, com um "pronto" no fim de cada uma, e quando eu consigo ver o progresso acontecendo. Quando o trabalho vira uma sequência de quests pequenas, eu rendo horas sem cansar. Quando ele vira uma nuvem de coisas ambíguas, eu travo.

O attention! nasceu dessa ideia: transformar o dia em um joguinho. Você cria um herói, define suas quests, e cada quest concluída vira XP. Acumulou XP suficiente, sobe de nível. Simples assim, mas é exatamente o tipo de retorno imediato que me mantém no foco.

## O que ele faz

- **Criação de herói:** você escolhe um nome, um sigilo e uma cor de destaque, e ganha um avatar próprio.
- **Quests de hoje:** até 3 tarefas diárias. A ideia é forçar foco: você escolhe as 3 coisas que importam hoje. Elas resetam a cada dia.
- **Quests avulsas:** tarefas maiores, sem prazo de dia, que valem mais XP.
- **Progressão:** cada quest concluída soma XP. A barra enche, o herói sobe de nível e a régua do próximo nível aumenta.

## Tecnologias

Eu quis montar um fullstack enxuto, sem dependências demais:

- **Front:** React + TypeScript com Vite, pensado mobile first.
- **Back:** Node com o módulo SQLite nativo (`node:sqlite`), sem ORM nem biblioteca externa de banco.
- **Banco:** SQLite, em arquivo local.

## Como rodar

Precisa de Node 22+ (eu uso o 24, pelo SQLite nativo) e do pnpm.

Em um terminal, sobe a API:

```bash
cd api
pnpm dev
```

Em outro terminal, sobe o front:

```bash
cd web
pnpm install
pnpm dev
```

O front sobe em `http://localhost:5173` e já faz proxy das chamadas `/api` pra API na porta 3333.

## Estrutura

```
attention!/
├── api/            API em Node + SQLite
│   └── src/
│       ├── db.js       banco, modelo e regras de XP/nível
│       └── server.js   rotas REST
└── web/            front em React + Vite
    └── src/
        ├── App.tsx
        ├── CreateCharacter.tsx
        ├── Home.tsx
        ├── QuestSection.tsx
        └── Avatar.tsx
```

## Próximos passos

- Conversor de ambiguidade: jogar uma tarefa nebulosa e ela virar quests claras (verbo + objeto + pronto).
- Recompensa agendada, pra amarrar lazer sem culpa às quests concluídas.
- Histórico dos dias, pra ver a sequência de dias cumpridos.
- Virar PWA instalável e publicar a API, pra usar de verdade no celular.
