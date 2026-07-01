# CATNotes — Rebranding e Redesign (spec)

Data: 2026-06-30
Origem do design: `CATNotes Sand.dc.html` (Claude Design, projeto 5c7f96d7)

## Objetivo

Reimplementar o app **Taskflow** com a nova identidade **CATNotes** (tema gato,
paleta quente âmbar/terracota, dark mode) em cima do código real: frontend
Next.js 16 + React 19 + Tailwind v4 e backend FastAPI + Supabase.

Escopo aprovado: **tudo do design**, incluindo o que exige mudança de backend.
Tags e streak ganham suporte real no backend (SQL fornecido para o Supabase).

## Restrições / stack

- Next.js **16.2.9** (App Router) — APIs podem divergir do conhecido; consultar
  `node_modules/next/dist/docs/` antes de escrever código.
- Tailwind **v4** (`@import "tailwindcss"`, `@theme inline` em `globals.css`).
- Arquivos pequenos e modulares (limite ~150 linhas por arquivo).
- Sem alterar o escopo de autenticação/multi-tenant existente (ver "Fora de escopo").

## Identidade visual (tokens)

Portar os tokens do design para CSS custom properties em `globals.css`, com
variante light (`:root`) e dark (`[data-theme="dark"]`), expostas via `@theme inline`.

Light: `--page:#f3eadd; --surf:#fffdf9; --surf2:#faf3e9; --card:#fffaf2;
--ink:#2a2420; --muted:#8a7d6e; --faint:#b5a690; --warm:#e6dccc; --warm2:#efe6d8;
--bar:#f1e7d8; --chk:#d8c6a8; --amber:#e0a15a; --terra:#cd7a52; --terradeep:#b86a4a;
--danger:#c0492f; --success:#3f8b54; --shadow:rgba(160,110,60,.42); --modal:rgba(42,36,32,.45)`

Dark: `--page:#19140f; --surf:#241c15; --surf2:#2d241b; --card:#2a2118;
--ink:#f3ebe0; --muted:#b1a18e; --faint:#7d6c5b; --warm:#3a2e23; --warm2:#332a20;
--bar:#332a20; --chk:#5a4a38; --amber:#e8ad66; --terra:#d98a5e; --terradeep:#c2734a;
--danger:#e06a4f; --success:#5aa873; --shadow:rgba(0,0,0,.6); --modal:rgba(0,0,0,.6)`

Fontes via `next/font/google`: **Space Grotesk** (títulos/marca), **Plus Jakarta
Sans** (corpo, default), **JetBrains Mono** (labels/contadores). Expostas como
`--font-display`, `--font-sans`, `--font-mono`.

Keyframes (em `globals.css`): `catBreathe`, `yarnRoll`, `tailSway`, `blink`,
`pawTrail`, `floatY`, `spin`, `toastIn`, `popIn`.

Marca: como não há `otto-mark.png`, criar um SVG inline (silhueta de cabeça de
gato) como componente `OttoMark`, usado na nav/telas de auth.

## Arquitetura frontend

Providers (client) montados no `app/layout.tsx`:

- **ThemeProvider** — estado `light|dark`, persistido em `localStorage`
  (`catnotes-theme`), aplica `data-theme` em `<html>`. Expõe `theme`, `toggle`,
  `setLight`, `setDark` via context. Evitar flash: script inline no `<head>` que
  lê o localStorage antes da hidratação.
- **ToastProvider** — `showToast(msg)` com auto-dismiss (~2.2s); renderiza o
  `Toast` fixo no rodapé.

Rotas (App Router):

- `/` → redireciona para `/login`.
- `/login` — layout split: painel âmbar (marca + slogan "Menos ruído. Mais
  feito." + paw trail) e formulário (email, senha, erro, botão, link registro).
- `/registro` — card único (marca, título, email, senha, erro/sucesso, botão,
  link login).
- `/tarefas` — nav (marca + toggle tema + avatar→perfil), header "Hoje" +
  contador `feitas/total`, barra de progresso, form nova tarefa, filtros
  (Todas/Pendentes/Concluídas), lista de tarefas, estado vazio com Otto. Novelo
  de lã animado decorativo. Protegida: sem token → redireciona a `/login`.
- `/perfil` — nav (voltar + título + toggle tema), avatar+nome+email, 3 stats
  (Concluídas, Pendentes, Dias seguidos), controle segmentado de aparência,
  switch "Resumo diário" (estado local/localStorage), botão sair (logout limpa
  token → `/login`).
- `not-found.tsx` — Otto + "404" + copy + botão voltar ao início.

Componentes (`components/`):

- `providers/ThemeProvider.tsx`, `providers/ToastProvider.tsx`
- `OttoMark.tsx` (SVG marca), `Otto.tsx` (gato CSS animado: respira, pisca,
  cauda) — usado em estado vazio e 404.
- `NavBar.tsx` (marca + toggle tema + avatar) reutilizável.
- `TarefaCard.tsx` — checkbox (pendente = contorno, concluída = gradiente ✓),
  título (riscado se concluída), chip de tag opcional, `×` → abre confirmação.
- `FormTarefa.tsx` — input + botão `+`.
- `ProgressBar.tsx`, `FilterChips.tsx`, `ConfirmDialog.tsx`, `Toast.tsx`.
- `ui/` helpers de classe se necessário (botão gradiente, input, card).

Fluxos de dados:

- Tarefas continuam via `services/api.ts`. `Tarefa` ganha `tag?: string | null`
  e `concluida_em?: string | null`.
- Filtros, `feitas/total`, `%`, Concluídas/Pendentes = derivados no cliente da
  lista de tarefas.
- **Streak (dias seguidos)** = derivado no cliente a partir dos `concluida_em`:
  número de dias consecutivos (data local) terminando hoje ou ontem com ≥1
  tarefa concluída. Helper puro `calcularStreak(datas: string[]): number` com
  testes.
- Toggle de tarefa envia `concluida`; backend seta/limpa `concluida_em`.
- Criar/editar tarefa pode enviar `tag`.

## Backend

`tarefas` ganha duas colunas nullable: `tag text`, `concluida_em timestamptz`.

- `app/models/tasks.py`: `CriarTarefa.tag: str | None = None`;
  `AtualizarTarefa.tag: str | None = None`.
- `app/routers/tasks.py` (ou service): ao atualizar, se `concluida` vier `True`
  setar `concluida_em = now()`; se `False`, setar `concluida_em = None`. Manter
  o filtro de campos `None` sem apagar `concluida_em` quando intencional.
- Retornar as novas colunas no payload (select `*` já cobre).

SQL para o Supabase (idempotente):

```sql
alter table tarefas add column if not exists tag text;
alter table tarefas add column if not exists concluida_em timestamptz;
```

## Testes

- `calcularStreak` — unit tests (dias consecutivos, quebra, hoje vs ontem,
  vazio, duplicados no mesmo dia).
- Lógica de derivação de filtros/progresso — testes se houver util isolado.
- Verificação manual: `next build`/lint no front; subir o app e navegar as telas
  (login→tarefas→perfil→404, toggle tema, add/toggle/delete, toast, modal).

## Fora de escopo (pré-existente, não alterar)

- `GET /tarefas` retorna todas as tarefas (não filtra por usuário) e o insert não
  associa `user_id`. Mantido como está; anotado como dívida conhecida.
- Persistência real de "Resumo diário" e streak no backend além do `concluida_em`.

## Critérios de aceite

- Telas login/registro/tarefas/perfil/404 batem com o design (light e dark).
- Toggle de tema persiste e sem flash.
- Add/toggle/delete de tarefa funcionam contra a API; delete pede confirmação;
  toast aparece.
- Tags aparecem quando presentes; streak reflete `concluida_em`.
- SQL entregue e models/rotas atualizados.
