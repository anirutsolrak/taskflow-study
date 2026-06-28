# Dúvidas — Bloco 02: Primeiro endpoint GET

---

## 1. O que é `unhashable type: 'list'`?

Esse erro aparece quando você tenta usar uma lista como chave de dicionário ou como elemento de um set.

Em Python, chaves de dicionário precisam ser imutáveis (string, número, tupla). Lista é mutável, então não pode ser chave.

O erro aconteceu porque o código usou `{}` com vírgula sem `:`, o que o Python interpretou como um **set**, não um dicionário:

```python
# ERRADO — Python leu isso como set, não dicionário
return {[{"id": 1, ...}], [{"id": 4, ...}]}

# CERTO — lista de dicionários
return [
    {"id": 1, "titulo": "estudo", "concluida": False},
    {"id": 2, "titulo": "trabalho", "concluida": False}
]
```

---

## 2. Qual a diferença entre dicionário, lista e lista de dicionários?

**Dicionário** — chave e valor, usa `{}` com `:`
```python
{"nome": "Carlos", "idade": 30}
```

**Lista** — sequência ordenada, usa `[]`
```python
[1, 2, 3]
```

**Lista de dicionários** — lista onde cada item é um dicionário. É o formato padrão de retorno de APIs REST:
```python
[
    {"id": 1, "titulo": "estudo"},
    {"id": 2, "titulo": "trabalho"}
]
```

---

## 3. Por que dicionário com chaves repetidas não funciona?

Em Python, dicionário não pode ter chaves repetidas. Se você repetir uma chave, o valor anterior é sobrescrito e só o último sobrevive.

```python
# ERRADO — "id" repetido, só o último fica
{"id": 1, "titulo": "estudo", "id": 2, "titulo": "trabalho"}
# resultado: {"id": 2, "titulo": "trabalho"}

# CERTO — cada tarefa é um dicionário separado dentro de uma lista
[
    {"id": 1, "titulo": "estudo"},
    {"id": 2, "titulo": "trabalho"}
]
```

---

## 4. Qual a diferença entre booleano e string no Python e no JSON?

**No Python:**
- Booleano: `True` e `False` com letra maiúscula, sem aspas
- String: `"true"` e `"false"` com aspas — são texto, não booleano

**No JSON retornado pela API:**
- Booleano correto: `false` e `true` minúsculo, sem aspas
- String incorreta: `"false"` e `"true"` com aspas

```python
# ERRADO — string disfarçada de booleano
{"concluida": "false"}

# CERTO — booleano de verdade
{"concluida": False}
```

O FastAPI converte `False` do Python para `false` no JSON automaticamente.

---

## 5. O que é `core.autocrlf` e por que configurar no Windows?

Existem dois padrões de quebra de linha:
- **LF** (Line Feed) — usado no Linux e Mac, padrão do Git e servidores
- **CRLF** (Carriage Return + Line Feed) — usado no Windows

Quando o Git avisa `LF will be replaced by CRLF`, ele está dizendo que vai converter automaticamente ao salvar no Windows.

Para silenciar o aviso e manter o comportamento correto:

```bash
git config --global core.autocrlf true
```

Isso diz ao Git: "pode converter automaticamente, estou no Windows." Só precisa rodar uma vez.

---

## Conceitos revisados nessa sessão

**Estruturas de dados Python:**
- `{}` com `:` = dicionário
- `[]` = lista
- `[{}, {}]` = lista de dicionários (formato padrão de API REST)
- `{}` com vírgula sem `:` = set (raramente usado)

**Booleanos Python vs JSON:**
- Python: `True` / `False` (maiúsculo, sem aspas)
- JSON: `true` / `false` (minúsculo, sem aspas)

**Commits:**
- Prefixos sempre em minúsculo: `feat:`, `fix:`, `chore:`, `docs:`
- Só commitar quando estiver funcionando, não commitar erro e correção separado
