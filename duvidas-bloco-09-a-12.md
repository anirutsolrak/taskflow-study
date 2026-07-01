# Dúvidas — Bloco 09: Componentes React com TypeScript

---

## 1. Por que usar `interface` para tipar props?

`interface` é o padrão do mercado para tipar props de componentes React. Define um "contrato": qualquer componente que use essa interface precisa ter exatamente os campos declarados, no tipo certo.

```tsx
interface TarefaCardProps {
  tarefa: Tarefa
}
```

---

## 2. Por que criar um tipo `Tarefa` compartilhado em vez de tipar direto no componente?

Reaproveitamento. O mesmo formato de dado (`Tarefa`) é usado em vários lugares: na página de listagem, no componente de card, nas funções de API. Definir uma vez em `types/index.ts` e importar evita duplicação e mantém consistência se o formato mudar.

```tsx
export interface Tarefa {
  id: string
  titulo: string
  concluida: boolean
  criado_em: string
}
```

---

## 3. Por que `key={tarefa.id}` e não `key={index}` no `.map()`?

O React usa a `key` para identificar de forma única cada item de uma lista e otimizar a renderização. Se você usa o índice do array como key, e a ordem dos itens muda (ex: depois de deletar um item do meio), o React pode confundir qual elemento é qual, causando bugs visuais ou de estado.

Usar um valor único e estável (como o `id` vindo do banco) evita esse problema.

---

# Dúvidas — Bloco 10: Fetch e estado

---

## 1. O que é `useState`?

Hook do React que cria uma variável de estado. Quando o valor muda via a função de atualização, o componente re-renderiza automaticamente.

```tsx
const [tarefas, setTarefas] = useState<Tarefa[]>([])
```

`tarefas` é a variável, `setTarefas` é a função para atualizar. Nunca se muda o estado diretamente, sempre pela função de set.

---

## 2. O que é `useEffect` e o que faz o array vazio `[]`?

Hook que executa código em resposta ao ciclo de vida do componente.

```tsx
useEffect(() => {
  // código
}, [])
```

O array `[]` no final controla quando o efeito roda:
- `[]` vazio: roda só uma vez, quando o componente aparece na tela
- `[algumaVariavel]`: roda toda vez que `algumaVariavel` mudar
- sem array: roda a cada renderização (raramente desejado)

---

## 3. Por que a rota `/tarefas` deu `307 Temporary Redirect`?

O FastAPI registra a rota com barra no final (`/tarefas/`) quando o router tem `prefix="/tarefas"` e a rota interna é `@router.get("/")`. Se a requisição do front for feita sem a barra (`/tarefas`), o FastAPI redireciona automaticamente com 307 para a versão com barra.

O `fetch` do navegador às vezes não segue esse redirect entre origens diferentes, causando "Failed to fetch". A correção é fazer a requisição já com a barra no final, batendo exatamente com a rota registrada:

```tsx
fetch(`${API_URL}/tarefas/`)
```

---

## 4. O que é CORS e por que a API bloqueava o front?

CORS (Cross-Origin Resource Sharing) é uma política de segurança do navegador que bloqueia requisições entre origens diferentes (domínios, portas ou protocolos diferentes) a menos que o servidor explicitamente autorize.

`localhost:3000` (front) e `localhost:8000` (back) são origens diferentes para o navegador, mesmo sendo a mesma máquina.

Solução: middleware de CORS no backend, autorizando a origem do front:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 5. O que é a requisição `OPTIONS` que aparece antes do POST?

É a **preflight request**. Antes de fazer um POST, PUT ou DELETE entre origens diferentes, o navegador manda automaticamente uma requisição `OPTIONS` perguntando ao servidor "você aceita esse tipo de requisição dessa origem?". Se o servidor não responder corretamente (por falta do middleware de CORS), o navegador bloqueia a requisição real com erro 405.

---

# Dúvidas — Bloco 11: Login e registro

---

## 1. Por que usar `localStorage` para guardar o token?

É a forma mais simples de persistir dados no navegador entre recarregamentos de página, nesse estágio do projeto. O token fica salvo mesmo se o usuário atualizar a página.

Limitação importante: `localStorage` só existe no browser, não no servidor. Como o Next.js roda código tanto no servidor quanto no cliente, é preciso ter cuidado para só acessar `localStorage` em contexto de cliente (`"use client"`).

---

## 2. O que é `useRouter()` e quando usar em vez de `<Link>`?

`<Link>` é para navegação baseada em clique do usuário, declarativa, sempre visível na tela como elemento de UI.

`useRouter()` é para navegação programática, disparada por código, geralmente após uma ação (como completar um login com sucesso):

```tsx
const router = useRouter()
router.push("/tarefas")
```

---

## 3. O que é um componente controlado?

É quando o valor de um input HTML é controlado pelo estado do React, não pelo DOM diretamente.

```tsx
<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

O `value` vem do estado (`email`), e toda vez que o usuário digita, `onChange` atualiza esse estado, que por sua vez atualiza o `value` do input. O React sempre sabe o valor atual do campo.

---

## 4. Para que serve `evento.preventDefault()`?

Impede o comportamento padrão do navegador ao submeter um formulário HTML, que seria recarregar a página inteira. Sem isso, o React perderia o controle da navegação e o estado da aplicação seria resetado a cada submit.

---

# Dúvidas — Bloco 12: CRUD completo no front

---

## 1. Por que `typeof window === "undefined"` antes de acessar `localStorage`?

O Next.js renderiza componentes tanto no servidor quanto no cliente. No servidor, o objeto `window` não existe (não há navegador), então tentar acessar `localStorage` lá quebra a aplicação.

```tsx
function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}
```

Essa verificação garante que só tentamos acessar `localStorage` quando o código está rodando no navegador.

---

## 2. O que é "levantar o estado" (lifting state up)?

Padrão onde um componente filho não tem a lógica de atualizar dados, apenas avisa o componente pai que algo aconteceu, passando os dados necessários. O pai é quem decide o que fazer.

```tsx
// TarefaCard (filho) só avisa
<button onClick={() => aoAlternar(tarefa.id, !tarefa.concluida)}>

// page.tsx (pai) decide o que fazer com o aviso
async function handleAlternar(id: string, concluida: boolean) {
  await atualizarTarefa(id, concluida)
  carregarTarefas()
}
```

Isso mantém os componentes pequenos reutilizáveis, sem saber dos detalhes de API ou de outras partes do sistema.

---

## 3. Por que o PUT e DELETE deram erro 422 mesmo com o id correto na URL?

O erro 422 (Unprocessable Content) indica que o corpo ou os parâmetros da requisição não bateram com o que o backend esperava validar.

A causa raiz foi a mesma do bloco 4: o tipo do `id` estava declarado como `number` em alguma parte do código TypeScript (provavelmente nas funções `atualizarTarefa` e `deletarTarefa` em `services/api.ts`), mas o banco usa UUID, que é `string`.

```tsx
// ERRADO
export async function deletarTarefa(id: number): Promise<void> { ... }

// CERTO
export async function deletarTarefa(id: string): Promise<void> { ... }
```

Mesmo o `id` "parecendo" um número em outros contextos, UUID sempre é tratado como string em toda a aplicação, do banco ao frontend.

---

## Resumo de erros recorrentes no projeto

1. **UUID tratado como `int`** — apareceu no backend (bloco 4) e no frontend (bloco 12). UUID é sempre `string`/`str`.
2. **Barra no final da URL** — rotas do FastAPI com `prefix` geram `/rota/` com barra; o front precisa bater exatamente.
3. **CORS** — toda comunicação entre `localhost:3000` e `localhost:8000` precisa do middleware configurado no backend.
4. **Tipos opcionais (`None`/`null`)** — sempre validar antes de acessar atributos de objetos que podem vir vazios (`response.user`, `response.session`).
