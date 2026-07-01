# CATNotes Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reimplementar Taskflow como CATNotes (tema gato, paleta quente, dark mode) no código real, com suporte de backend para tags e streak.

**Architecture:** Frontend Next.js 16 App Router + Tailwind v4 com tokens CSS (light/dark via `data-theme` no `<html>`), providers de tema e toast, componentes pequenos e focados. Backend FastAPI + Supabase ganha colunas `tag` e `concluida_em`; streak e stats derivados no cliente.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind v4, next/font, FastAPI, Supabase.

## Global Constraints

- Next.js 16.2.9 — consultar `node_modules/next/dist/docs/` antes de usar APIs incertas do App Router.
- Tailwind v4: `@import "tailwindcss"` + `@theme inline` em `app/globals.css`. Sem `tailwind.config.js`.
- Arquivos ~150 linhas no máximo; componentes focados.
- Fonte da verdade do visual: `CATNotes Sand.dc.html` (design). Portar estilos fielmente, convertendo `var(--x)` para tokens Tailwind/CSS.
- Marca: usar componente `OttoMark` (SVG inline), pois `otto-mark.png` não existe.
- Nome do produto em toda copy/metadata: **CATNotes**.
- Não alterar escopo multi-tenant do backend (dívida conhecida).
- Commits frequentes, um por task.

## File Structure

Backend:
- `app/models/tasks.py` (mod) — campo `tag`.
- `app/routers/tasks.py` (mod) — set/clear `concluida_em`, aceitar `tag`.
- SQL entregue ao usuário (não versionado obrigatoriamente).

Frontend (`taskflow-front/`):
- `app/globals.css` (mod) — tokens light/dark, fontes, keyframes, utilitários.
- `app/layout.tsx` (mod) — fontes next/font, providers, no-flash script, metadata.
- `app/page.tsx` (mod) — redirect para `/login`.
- `app/login/page.tsx`, `app/registro/page.tsx`, `app/tarefas/page.tsx` (mod).
- `app/perfil/page.tsx` (new), `app/not-found.tsx` (new).
- `components/providers/ThemeProvider.tsx`, `components/providers/ToastProvider.tsx` (new).
- `components/OttoMark.tsx`, `components/Otto.tsx` (new).
- `components/NavBar.tsx`, `components/ProgressBar.tsx`, `components/FilterChips.tsx`, `components/ConfirmDialog.tsx`, `components/Toast.tsx` (new).
- `components/TarefaCard.tsx`, `components/FormTarefa.tsx` (mod).
- `lib/streak.ts` (new) + `lib/streak.test.ts` (new, vitest).
- `types/index.ts`, `services/api.ts` (mod).
- `package.json` (mod) — devDep vitest + script `test`.

---

### Task 1: Backend — colunas tag e concluida_em

**Files:**
- Modify: `app/models/tasks.py`
- Modify: `app/routers/tasks.py`

**Interfaces:**
- Produces: `CriarTarefa{titulo, concluida, tag?}`, `AtualizarTarefa{titulo?, concluida?, tag?}`. API `tarefas` retorna `tag`, `concluida_em` no JSON.

- [ ] **Step 1: SQL do Supabase (entregar ao usuário, executar no painel)**

```sql
alter table tarefas add column if not exists tag text;
alter table tarefas add column if not exists concluida_em timestamptz;
```

- [ ] **Step 2: Models** — `app/models/tasks.py`:

```python
from pydantic import BaseModel

class CriarTarefa(BaseModel):
    titulo: str
    concluida: bool = False
    tag: str | None = None

class AtualizarTarefa(BaseModel):
    titulo: str | None = None
    concluida: bool | None = None
    tag: str | None = None
```

- [ ] **Step 3: Router** — em `app/routers/tasks.py`, no `atualizar_tarefa`, após montar `dados_atualizados`, refletir `concluida_em`:

```python
    dados_atualizados = {campo: valor for campo, valor in tarefa.model_dump().items() if valor is not None}
    if tarefa.concluida is not None:
        dados_atualizados["concluida_em"] = "now()" if tarefa.concluida else None
```

Nota: se `"now()"` como string não resolver no Supabase, usar `datetime.now(timezone.utc).isoformat()` (import no topo).

- [ ] **Step 4: Verificar** — subir a API (`uvicorn app.main:app --reload`), criar tarefa com `tag`, alternar concluída e confirmar `concluida_em` preenchido/limpo via `GET /tarefas`.

- [ ] **Step 5: Commit**

```bash
git add app/models/tasks.py app/routers/tasks.py
git commit -m "feat(back): tag e concluida_em nas tarefas"
```

---

### Task 2: Tokens, fontes e keyframes (globals.css + layout)

**Files:**
- Modify: `taskflow-front/app/globals.css`
- Modify: `taskflow-front/app/layout.tsx`

**Interfaces:**
- Produces: classes utilitárias `bg-page bg-surf bg-surf2 bg-card text-ink text-muted text-faint border-warm border-warm2` e vars `--amber --terra --terradeep --danger --success --bar --chk --shadow --modal`; fontes `font-display font-sans font-mono`; keyframes CSS. `data-theme="dark"` no `<html>` troca o tema.

- [ ] **Step 1: globals.css** — substituir conteúdo por: `@import "tailwindcss";`, bloco `:root{ --page:#f3eadd; ... }` (todos os tokens light do spec), bloco `[data-theme="dark"]{ ... }` (tokens dark do spec), `@theme inline{ --color-page:var(--page); --color-surf:var(--surf); --color-surf2:var(--surf2); --color-card:var(--card); --color-ink:var(--ink); --color-muted:var(--muted); --color-faint:var(--faint); --color-warm:var(--warm); --color-warm2:var(--warm2); --font-display:var(--font-space-grotesk); --font-sans:var(--font-jakarta); --font-mono:var(--font-jetbrains); }`, `body{ background:var(--page); color:var(--ink); font-family:var(--font-sans); }`, e os `@keyframes` do design (catBreathe, yarnRoll, tailSway, blink, pawTrail, floatY, spin, toastIn, popIn). Manter arquivo focado só em tokens/base.

- [ ] **Step 2: layout.tsx** — importar fontes:

```tsx
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
const display = Space_Grotesk({ subsets:["latin"], variable:"--font-space-grotesk" })
const sans = Plus_Jakarta_Sans({ subsets:["latin"], variable:"--font-jakarta" })
const mono = JetBrains_Mono({ subsets:["latin"], variable:"--font-jetbrains" })
```

Aplicar `className={\`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased\`}` no `<html>`; `metadata.title = "CATNotes"`, `description = "O jeito calmo de organizar o dia."`. Envolver `{children}` com os providers das tasks 3 e 4 (adicionar imports quando existirem). Adicionar no-flash script (Task 3, Step 3).

- [ ] **Step 3: Verificar** — `cd taskflow-front && npm run build` compila; `body` usa fundo `--page`.

- [ ] **Step 4: Commit**

```bash
git add taskflow-front/app/globals.css taskflow-front/app/layout.tsx
git commit -m "feat(front): tokens de tema, fontes e keyframes CATNotes"
```

---

### Task 3: ThemeProvider (+ no-flash)

**Files:**
- Create: `taskflow-front/components/providers/ThemeProvider.tsx`
- Modify: `taskflow-front/app/layout.tsx`

**Interfaces:**
- Produces: `useTheme(): { theme:"light"|"dark", toggle():void, setLight():void, setDark():void }`. Provider aplica `data-theme` em `document.documentElement` e persiste em `localStorage["catnotes-theme"]`.

- [ ] **Step 1: ThemeProvider.tsx** — `"use client"`; context com estado inicial lido de `document.documentElement.getAttribute("data-theme")` (fallback `"light"`); `useEffect` grava `data-theme` no `<html>` e no localStorage; expõe `toggle/setLight/setDark`. Lançar erro se `useTheme` usado fora do provider.

- [ ] **Step 2: layout.tsx** — importar e envolver children com `<ThemeProvider>`.

- [ ] **Step 3: No-flash script** — no `<head>` do layout, antes do body, um `<script dangerouslySetInnerHTML>` que lê `localStorage["catnotes-theme"]` e seta `document.documentElement.dataset.theme` antes da hidratação.

- [ ] **Step 4: Verificar** — `npm run build`; alternar tema persiste após reload, sem flash.

- [ ] **Step 5: Commit**

```bash
git add taskflow-front/components/providers/ThemeProvider.tsx taskflow-front/app/layout.tsx
git commit -m "feat(front): ThemeProvider com dark mode persistente"
```

---

### Task 4: ToastProvider + Toast

**Files:**
- Create: `taskflow-front/components/providers/ToastProvider.tsx`
- Create: `taskflow-front/components/Toast.tsx`
- Modify: `taskflow-front/app/layout.tsx`

**Interfaces:**
- Produces: `useToast(): { showToast(msg:string):void }`. Toast fixo no rodapé, auto-dismiss ~2200ms, `animation:toastIn`.

- [ ] **Step 1: Toast.tsx** — `"use client"`; recebe `mensagem:string|null`; renderiza a caixa fixa (estilos do design: `position:fixed; bottom:28px; left:50%; ...`) só quando há mensagem.

- [ ] **Step 2: ToastProvider.tsx** — `"use client"`; estado `msg`, `showToast` seta e agenda `setTimeout` (limpando o anterior); renderiza `<Toast mensagem={msg}/>` + children.

- [ ] **Step 3: layout.tsx** — envolver children com `<ToastProvider>` (dentro do ThemeProvider).

- [ ] **Step 4: Verificar** — `npm run build` ok.

- [ ] **Step 5: Commit**

```bash
git add taskflow-front/components/providers/ToastProvider.tsx taskflow-front/components/Toast.tsx taskflow-front/app/layout.tsx
git commit -m "feat(front): ToastProvider"
```

---

### Task 5: OttoMark (SVG) + Otto (gato CSS animado)

**Files:**
- Create: `taskflow-front/components/OttoMark.tsx`
- Create: `taskflow-front/components/Otto.tsx`

**Interfaces:**
- Produces: `OttoMark({ size?:number })` — SVG silhueta de cabeça de gato, `currentColor`. `Otto()` — gato CSS (respira/pisca/cauda), portado do `ottoEl()` do design (mesmas medidas/animações), usando `var(--amber)/var(--terra)/var(--terradeep)`.

- [ ] **Step 1: OttoMark.tsx** — componente puro que retorna um `<svg viewBox="0 0 24 24">` com cabeça de gato + orelhas triangulares, `fill="currentColor"`, `width/height={size ?? 30}`. Sem `"use client"`.

- [ ] **Step 2: Otto.tsx** — portar `ottoEl()` do design para JSX (div relativo 150x150 com cauda, corpo, barriga, orelhas, cabeça, olhos que piscam, nariz, patas), usando as mesmas animações (`catBreathe`, `tailSway`, `blink`). Estilos inline como no design.

- [ ] **Step 3: Verificar** — `npm run build` ok; renderizar Otto numa página temporária ou confiar na Task 9.

- [ ] **Step 4: Commit**

```bash
git add taskflow-front/components/OttoMark.tsx taskflow-front/components/Otto.tsx
git commit -m "feat(front): mascote Otto e marca OttoMark"
```

---

### Task 6: Helper de streak (TDD) + vitest

**Files:**
- Create: `taskflow-front/lib/streak.ts`
- Create: `taskflow-front/lib/streak.test.ts`
- Modify: `taskflow-front/package.json`

**Interfaces:**
- Produces: `calcularStreak(datas: (string|null|undefined)[], hoje?: Date): number` — nº de dias consecutivos (data local) terminando hoje ou ontem com ≥1 conclusão.

- [ ] **Step 1: package.json** — adicionar `"vitest": "^2"` em devDependencies e `"test": "vitest run"` em scripts. Rodar `npm install`.

- [ ] **Step 2: Teste falho** — `lib/streak.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { calcularStreak } from "./streak"

const d = (s: string) => s + "T12:00:00Z"
describe("calcularStreak", () => {
  const hoje = new Date("2026-06-30T12:00:00Z")
  it("vazio => 0", () => expect(calcularStreak([], hoje)).toBe(0))
  it("só hoje => 1", () => expect(calcularStreak([d("2026-06-30")], hoje)).toBe(1))
  it("3 dias consecutivos ate hoje => 3", () =>
    expect(calcularStreak([d("2026-06-28"), d("2026-06-29"), d("2026-06-30")], hoje)).toBe(3))
  it("duplicados no mesmo dia contam 1", () =>
    expect(calcularStreak([d("2026-06-30"), d("2026-06-30")], hoje)).toBe(1))
  it("termina ontem ainda conta", () =>
    expect(calcularStreak([d("2026-06-28"), d("2026-06-29")], hoje)).toBe(2))
  it("quebra corta a sequencia", () =>
    expect(calcularStreak([d("2026-06-25"), d("2026-06-29"), d("2026-06-30")], hoje)).toBe(2))
  it("ignora nulls", () =>
    expect(calcularStreak([null, undefined, d("2026-06-30")], hoje)).toBe(1))
})
```

- [ ] **Step 3: Rodar e ver falhar** — `cd taskflow-front && npm test` → FAIL (module not found).

- [ ] **Step 4: Implementar** — `lib/streak.ts`:

```ts
export function calcularStreak(datas: (string | null | undefined)[], hoje: Date = new Date()): number {
  const chave = (dt: Date) => `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`
  const dias = new Set(datas.filter(Boolean).map((s) => chave(new Date(s as string))))
  if (dias.size === 0) return 0
  const cursor = new Date(hoje)
  if (!dias.has(chave(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!dias.has(chave(cursor))) return 0
  }
  let n = 0
  while (dias.has(chave(cursor))) {
    n++
    cursor.setDate(cursor.getDate() - 1)
  }
  return n
}
```

- [ ] **Step 5: Rodar e ver passar** — `npm test` → todos PASS.

- [ ] **Step 6: Commit**

```bash
git add taskflow-front/lib/streak.ts taskflow-front/lib/streak.test.ts taskflow-front/package.json taskflow-front/package-lock.json
git commit -m "feat(front): calcularStreak com testes (vitest)"
```

---

### Task 7: Tipos + services/api (tag, concluida_em)

**Files:**
- Modify: `taskflow-front/types/index.ts`
- Modify: `taskflow-front/services/api.ts`

**Interfaces:**
- Consumes: API da Task 1.
- Produces: `Tarefa{ id, titulo, concluida, criado_em, tag?:string|null, concluida_em?:string|null }`; `criarTarefa(titulo:string, tag?:string)`.

- [ ] **Step 1: types/index.ts** — adicionar `tag?: string | null` e `concluida_em?: string | null` em `Tarefa`.

- [ ] **Step 2: services/api.ts** — `criarTarefa(titulo, tag?)` inclui `tag` no body quando definido. Demais funções inalteradas.

- [ ] **Step 3: Verificar** — `npm run build` (types ok).

- [ ] **Step 4: Commit**

```bash
git add taskflow-front/types/index.ts taskflow-front/services/api.ts
git commit -m "feat(front): tipos e api com tag/concluida_em"
```

---

### Task 8: Tela de Login

**Files:**
- Modify: `taskflow-front/app/login/page.tsx`

**Interfaces:**
- Consumes: `login()` (api), `useRouter`.

- [ ] **Step 1: Implementar** — portar o layout split do design (painel âmbar com `OttoMark` + slogan "Menos ruído. Mais feito." + paw trail animado; formulário com labels, inputs tokenizados, bloco de erro, botão gradiente "Entrar →", link "Criar conta" → `/registro`). Manter a lógica atual (`handleSubmit`, `localStorage access_token`, `router.push("/tarefas")`). Responsivo: painel some/empilha em telas estreitas (`hidden md:flex` no painel).

- [ ] **Step 2: Verificar** — `npm run dev`, abrir `/login`, conferir visual light/dark e submit.

- [ ] **Step 3: Commit**

```bash
git add taskflow-front/app/login/page.tsx
git commit -m "feat(front): tela de login CATNotes"
```

---

### Task 9: Tela de Registro

**Files:**
- Modify: `taskflow-front/app/registro/page.tsx`

- [ ] **Step 1: Implementar** — portar o card único do design (marca `OttoMark` + "CATNotes", título "Criar conta", subtítulo, inputs email/senha tokenizados, bloco erro e bloco sucesso, botão gradiente, link "Entrar" → `/login`). Manter lógica atual (`registrar`, push `/login`). Adicionar estado de sucesso opcional exibindo "Conta criada. Entrando…" antes do redirect.

- [ ] **Step 2: Verificar** — `/registro` visual + submit.

- [ ] **Step 3: Commit**

```bash
git add taskflow-front/app/registro/page.tsx
git commit -m "feat(front): tela de registro CATNotes"
```

---

### Task 10: Componentes da lista (NavBar, ProgressBar, FilterChips, FormTarefa, TarefaCard, ConfirmDialog)

**Files:**
- Create: `taskflow-front/components/NavBar.tsx`
- Create: `taskflow-front/components/ProgressBar.tsx`
- Create: `taskflow-front/components/FilterChips.tsx`
- Create: `taskflow-front/components/ConfirmDialog.tsx`
- Modify: `taskflow-front/components/FormTarefa.tsx`
- Modify: `taskflow-front/components/TarefaCard.tsx`

**Interfaces:**
- Produces:
  - `NavBar({ titulo?, mostrarAvatar?, aoVoltar? })` — marca + toggle de tema (`useTheme`) + avatar (link `/perfil`) ou botão voltar.
  - `ProgressBar({ pct:number })` — barra `--bar` com preenchimento gradiente.
  - `FilterChips({ filtro, onChange })` com `filtro: "todas"|"pendentes"|"concluidas"`.
  - `FormTarefa({ valor, onChange, onSubmit })` — input + botão `+`.
  - `TarefaCard({ tarefa, aoAlternar, aoPedirDelete })` — checkbox custom, título (riscado se concluída), chip de tag se `tag && !concluida`, `×` chama `aoPedirDelete(id)`.
  - `ConfirmDialog({ aberto, onCancel, onConfirm })` — overlay `--modal`, `animation:popIn`.

- [ ] **Step 1: NavBar** — portar nav do design; toggle usa `useTheme().toggle`, ícone `themeIcon = theme==="dark" ? "☀" : "☾"`. Avatar link para `/perfil`. Se `aoVoltar` fornecido, mostra botão `←` no lugar da marca clicável.

- [ ] **Step 2: ProgressBar / FilterChips / FormTarefa / ConfirmDialog** — portar estilos do design (chips ativos = gradiente; inativos = borda). `FormTarefa` botão `+` gradiente.

- [ ] **Step 3: TarefaCard** — reescrever conforme design: `aoAlternar(id, !concluida)`, `aoPedirDelete(id)`; checkbox concluída = quadrado gradiente com `✓`, pendente = quadrado com borda `--chk`. Chip tag com estilo mono.

- [ ] **Step 4: Verificar** — `npm run build` ok (uso real na Task 11).

- [ ] **Step 5: Commit**

```bash
git add taskflow-front/components/NavBar.tsx taskflow-front/components/ProgressBar.tsx taskflow-front/components/FilterChips.tsx taskflow-front/components/ConfirmDialog.tsx taskflow-front/components/FormTarefa.tsx taskflow-front/components/TarefaCard.tsx
git commit -m "feat(front): componentes da lista de tarefas"
```

---

### Task 11: Tela de Tarefas

**Files:**
- Modify: `taskflow-front/app/tarefas/page.tsx`

**Interfaces:**
- Consumes: `NavBar, ProgressBar, FilterChips, FormTarefa, TarefaCard, ConfirmDialog, Otto`, api de tarefas, `useToast`.

- [ ] **Step 1: Implementar** — card container do design com `NavBar` (avatar), header "Hoje" + `feitas/total`, `ProgressBar pct`, `FormTarefa`, `FilterChips`, lista filtrada de `TarefaCard`, estado vazio com `Otto` + copy. Novelo de lã decorativo (opcional). Estado: `filtro`, `confirmId`. `handleCriar` chama `showToast("Tarefa adicionada.")`; delete via `ConfirmDialog` → `showToast("Tarefa removida")`. Guard: sem `localStorage.access_token` → `router.replace("/login")`. Loading = spinner do design ("Organizando seu dia…").

- [ ] **Step 2: Verificar** — `/tarefas` com API rodando: add/toggle/delete/filtros/empty/toast/modal, light+dark.

- [ ] **Step 3: Commit**

```bash
git add taskflow-front/app/tarefas/page.tsx
git commit -m "feat(front): tela de tarefas CATNotes"
```

---

### Task 12: Tela de Perfil

**Files:**
- Create: `taskflow-front/app/perfil/page.tsx`

**Interfaces:**
- Consumes: `NavBar` (com `aoVoltar`), `useTheme`, `calcularStreak`, api `buscarTarefas`.

- [ ] **Step 1: Implementar** — card do design: `NavBar` com voltar (`router.push("/tarefas")`) + título "Perfil" + toggle tema. Avatar+nome+email (email de placeholder/estado; nome derivado do email antes do `@`). 3 stats: Concluídas (`feitas`), Pendentes (`total-feitas`), Dias seguidos (`calcularStreak(tarefas.map(t=>t.concluida_em))`). Controle segmentado Claro/Escuro (`setLight/setDark`). Switch "Resumo diário" (estado local persistido em `localStorage["catnotes-resumo"]`). Botão "Sair da conta" → limpa token, `router.push("/login")`. Buscar tarefas no mount para stats.

- [ ] **Step 2: Verificar** — `/perfil` stats corretas, segmentado troca tema, switch alterna, logout funciona.

- [ ] **Step 3: Commit**

```bash
git add taskflow-front/app/perfil/page.tsx
git commit -m "feat(front): tela de perfil CATNotes"
```

---

### Task 13: 404 + redirect da raiz

**Files:**
- Create: `taskflow-front/app/not-found.tsx`
- Modify: `taskflow-front/app/page.tsx`

- [ ] **Step 1: not-found.tsx** — portar 404 do design (`Otto`, "404", copy "Essa página fugiu pela janela.", botão "Voltar ao início" → link `/tarefas`). Client component com botão/link.

- [ ] **Step 2: page.tsx** — substituir por `redirect("/login")` (server: `import { redirect } from "next/navigation"`).

- [ ] **Step 3: Verificar** — `/` redireciona a `/login`; rota inexistente mostra 404 estilizado.

- [ ] **Step 4: Commit**

```bash
git add taskflow-front/app/not-found.tsx taskflow-front/app/page.tsx
git commit -m "feat(front): 404 CATNotes e redirect da raiz"
```

---

### Task 14: Verificação final

- [ ] **Step 1:** `cd taskflow-front && npm test` → PASS.
- [ ] **Step 2:** `npm run lint` → sem erros novos.
- [ ] **Step 3:** `npm run build` → sucesso.
- [ ] **Step 4:** Verificação manual com backend rodando: login→tarefas→perfil→404, dark mode persistente, add/toggle/delete + toast + modal, tag e streak.
- [ ] **Step 5:** Entregar ao usuário o SQL do Supabase (Task 1, Step 1) e confirmar execução.
- [ ] **Step 6: Commit** de qualquer ajuste final.

## Self-Review

- **Cobertura do spec:** tokens/fontes (T2), tema/dark (T2/T3), toast (T4), Otto/marca (T5), streak (T6), api/tipos (T7), login (T8), registro (T9), componentes+card+tags (T10), tarefas (T11), perfil+stats+streak (T12), 404+redirect (T13), backend tag/concluida_em+SQL (T1). ✓
- **Placeholders:** lógica não-óbvia (streak, concluida_em, tokens, no-flash) tem código; JSX mecânico referencia o design como fonte fiel. ✓
- **Consistência de tipos:** `Tarefa` estende com `tag?`/`concluida_em?`; `calcularStreak(datas, hoje?)`; nomes de props dos componentes consistentes entre T10 e T11/T12. ✓

