# Dúvidas — Bloco 03: Conexão com Supabase

---

## 1. O que é `import os`?

`os` é um módulo da biblioteca padrão do Python que dá acesso a funcionalidades do sistema operacional. O nome vem de **Operating System**.

```python
os.getenv("SUPABASE_URL")
```

Vai até as variáveis de ambiente do sistema operacional e pega o valor de `SUPABASE_URL`. É exatamente como uma ordem de serviço: "vai lá no ambiente, pega essa variável e traz pra mim."

O `load_dotenv()` que vem antes é o que faz o `.env` virar variável de ambiente primeiro. Sem ele, o `os.getenv` não encontraria nada porque o `.env` é só um arquivo de texto.

**Fluxo:**
1. `load_dotenv()` — lê o `.env` e registra as variáveis no ambiente
2. `os.getenv("SUPABASE_URL")` — busca a variável no ambiente e traz o valor

---

## 2. Por que `from app.db.supabase import supabase` e não `import supabase`?

Quando você faz `import supabase`, o Python procura um módulo chamado `supabase` **instalado no ambiente** via pip. Ele não sabe que você tem um arquivo `supabase.py` dentro de `app/db/`.

Quando você faz `from app.db.supabase import supabase`, você dá o caminho exato: "entra na pasta `app`, depois em `db`, abre o arquivo `supabase.py`, e pega a variável `supabase` que está lá dentro."

Os dois têm o mesmo nome, então o caminho completo elimina a ambiguidade.

---

## 3. Por que o Pylance reclama do `os.getenv()`?

`os.getenv()` pode retornar `str` ou `None` (caso a variável não exista no `.env`). Mas `create_client` espera `str` garantido, nunca `None`.

**Solução:**

```python
url: str = os.getenv("SUPABASE_URL") or ""
key: str = os.getenv("SUPABASE_KEY") or ""
```

O `or ""` resolve: se `os.getenv` retornar `None`, cai no `or` e usa string vazia. O tipo sempre será `str`.

---

## 4. Por que o UUID do Supabase precisa de `str()` para retornar na rota `/status`?

`supabase.supabase_url` retorna um objeto do tipo `URL`, não uma string simples. O FastAPI não consegue converter esse objeto para JSON automaticamente.

```python
# ERRADO — objeto URL não é serializável
return {"url": supabase.supabase_url}

# CERTO — converte para string antes
return {"url": str(supabase.supabase_url)}
```

---

## 5. O que é RLS e por que bloqueou a inserção?

RLS (Row Level Security) é uma camada de segurança do PostgreSQL que bloqueia operações no banco sem saber quem está fazendo. Por padrão o Supabase cria tabelas com RLS ativado.

A chave `anon` respeita o RLS e exige usuário autenticado. A chave `service_role` bypassa o RLS e tem acesso total — é a chave correta para usar no backend, que é um ambiente controlado e confiável.

A `service_role` nunca pode ir para o frontend nem para o GitHub.

---

## 6. Convenção do Supabase para criação de tabelas

O Supabase usa UUID como padrão para chave primária, não inteiro sequencial:

```sql
create table tarefas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  concluida boolean not null default false,
  criado_em timestamp with time zone not null default now()
);
```

`gen_random_uuid()` gera um identificador único aleatório. É mais seguro que inteiro sequencial porque não expõe quantos registros existem.

`timestamp with time zone` é equivalente a `TIMESTAMPTZ`, só escrito por extenso.

---

# Dúvidas — Bloco 04: CRUD de tarefas

---

## 1. O que é CRUD?

Acrônimo das quatro operações básicas de qualquer sistema que persiste dados:

- **C**reate — criar
- **R**ead — ler
- **U**pdate — atualizar
- **D**elete — deletar

---

## 2. O que é `APIRouter` e por que usar?

`APIRouter` é um objeto do FastAPI que funciona como o `app`, mas fica em arquivo separado. O `main.py` importa e registra o router.

Sem router, todas as rotas ficariam no `main.py`, que ficaria enorme com o tempo. Com router, cada grupo de rotas fica no seu arquivo.

```python
# app/routers/tasks.py
router = APIRouter()

@router.get("/")
def listar_tarefas():
    ...

# app/main.py
app.include_router(tasks_router, prefix="/tarefas", tags=["tarefas"])
```

`prefix="/tarefas"` — todas as rotas do router ganham `/tarefas` na frente automaticamente.
`tags=["tarefas"]` — agrupa as rotas no `/docs` por categoria.

---

## 3. Por que usamos alias no import do router?

```python
from app.routers.tasks import router as tasks_router
from app.routers.auth import router as auth_router
```

O nome `router` é genérico e vai se repetir em cada arquivo. Sem alias, o segundo import sobrescreveria o primeiro silenciosamente. O alias é como colocar sobrenome quando tem duas pessoas com o mesmo nome na mesma sala.

---

## 4. O que é `model_dump()`?

Método do Pydantic que converte um objeto de modelo em dicionário Python:

```python
tarefa = TarefaCreate(titulo="estudar", concluida=False)
tarefa.model_dump()
# resultado: {"titulo": "estudar", "concluida": False}
```

O Supabase recebe dicionário, não objeto Pydantic. Por isso a conversão.

---

## 5. Como nomear variáveis de loop corretamente?

Evitar abreviações de letra única que não descrevem nada:

```python
# RUIM — o que é k? o que é v?
for k, v in tarefa.model_dump().items():
    if v is not None:
        dados[k] = v

# BOM — campo e valor descrevem o que está sendo iterado
for campo, valor in tarefa.model_dump().items():
    if valor is not None:
        dados[campo] = valor
```

Nome de variável tem que descrever o que ela guarda.

---

## 6. Por que o UUID usa `str` no código se parece um número?

UUID tem esse formato: `8e4704d0-a784-42b8-824e-816f11673647`

Contém letras (`a` a `f`) porque usa base hexadecimal (base 16: 0-9 e a-f), não decimal. Além disso tem hífens. Nenhum tipo inteiro nativo consegue guardar isso.

Por isso é `str`: o UUID chega como texto, é armazenado como texto, e é comparado como texto.

---

## 7. Como funciona o `.eq()` do cliente Supabase?

```python
supabase.table("tarefas").update(dados).eq("id", tarefa_id).execute()
```

`.eq("id", tarefa_id)` é equivalente a `WHERE id = tarefa_id` no SQL. Filtra qual linha será afetada pela operação.

Leitura completa: "na tabela tarefas, atualize com esses dados, onde o id for igual a tarefa_id, e execute."
