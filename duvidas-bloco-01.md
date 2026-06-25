# Dúvidas — Bloco 01: Arquitetura e configuração inicial

---

## 1. O que é Pydantic? É o TypeScript do Python?

Quase isso, mas com uma diferença importante de momento.

**TypeScript** garante tipos em tempo de desenvolvimento — antes de rodar o código, o editor reclama se algo estiver errado.

**Pydantic** garante tipos em tempo de execução — enquanto o programa está rodando. Se alguém mandar uma requisição com `idade: "vinte"` em vez de `idade: 20`, o Pydantic rejeita automaticamente e devolve um erro, sem você escrever nenhuma validação manual.

Exemplo:

```python
from pydantic import BaseModel

class Tarefa(BaseModel):
    titulo: str
    concluida: bool = False
```

O FastAPI usa essa classe pra validar tudo que chega na rota. Se o corpo da requisição não tiver `titulo` como string, ele rejeita antes de chegar no seu código.

**Resumo:** TypeScript anota os tipos pra você e o editor reclama. Pydantic valida os dados em tempo real e a API reclama. Propósitos parecidos, momentos diferentes.

---

## 2. Para que serve a flag `-m` no Git?

Serve pra escrever a mensagem do commit direto na linha de comando, sem abrir um editor de texto.

**Sem ela:**
```bash
git commit
```
O Git abre o Vim ou o editor padrão esperando você digitar a mensagem lá dentro.

**Com ela:**
```bash
git commit -m "feat: adiciona rota de tarefas"
```
Você passa a mensagem direto, o commit é feito na hora, sem abrir nada. É o padrão usado no dia a dia.

---

## 3. No Python a flag `-m` também existe. É a mesma coisa?

Não. São flags com a mesma letra mas em contextos completamente diferentes.

**Git `-m`** = mensagem do commit.

**Python `-m`** = rodar um módulo como script.

```bash
python -m venv venv
```

Aqui você está dizendo: "Python, rode o módulo `venv`." O Python procura o módulo dentro da instalação dele e executa.

É diferente de:

```bash
python venv.py
```

Que rodaria um arquivo chamado `venv.py` no diretório atual.

---

## 4. Para que serve a flag `-u` no `git push`?

Serve pra vincular o branch local com o branch remoto.

```bash
git push -u origin main
```

Você está dizendo: "sobe pro GitHub E grava que esse branch local `main` está conectado ao `origin/main`."

Depois disso, nos próximos pushes você pode rodar só:

```bash
git push
```

Sem precisar especificar `origin main` de novo. O Git já sabe pra onde mandar.

Você só precisa do `-u` na primeira vez.

---

## 5. A flag `-u` é abreviação de qual palavra?

É abreviação de `--set-upstream`.

Upstream significa "de onde vem" ou "pra onde aponta". No contexto do Git, o upstream de um branch local é o branch remoto correspondente.

Então `-u` está dizendo: "define o upstream desse branch local como `origin/main`."

Não tem relação com "untracked". Untracked é arquivo que o Git ainda não conhece — contexto completamente diferente.

---

## 6. Por que as pastas vazias não subiram pro GitHub?

O Git não rastreia pastas vazias. Se você criou as pastas mas não colocou nenhum arquivo dentro, o Git simplesmente ignora elas.

A solução padrão é criar um arquivo `.gitkeep` dentro de cada pasta vazia. É um arquivo em branco que existe só pra forçar o Git a reconhecer a pasta.

```bash
touch app/routers/.gitkeep
touch app/models/.gitkeep
touch app/services/.gitkeep
touch app/db/.gitkeep
```

---

## Convenções aprendidas nessa sessão

**Prefixos de commit:**
- `feat:` funcionalidade nova
- `fix:` correção de bug
- `chore:` configuração, ajuste sem impacto no código
- `docs:` documentação
- `refactor:` refatoração sem mudar comportamento

**Commits sempre em português.**

**Mensagem usada no bloco 1:**
```
chore: adiciona estrutura inicial do projeto
```
