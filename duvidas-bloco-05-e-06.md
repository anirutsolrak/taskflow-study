# Dúvidas — Bloco 05: Autenticação com Supabase Auth

---

## 1. O que é JWT?

JWT (JSON Web Token) é um token no formato `xxxxx.yyyyy.zzzzz`, dividido em três partes separadas por ponto:

- **Header** — tipo do token e algoritmo de assinatura
- **Payload** — dados do usuário (id, email, quando expira)
- **Signature** — assinatura que prova que o token não foi adulterado

O backend não precisa consultar o banco para validar o token. Ele mesmo consegue verificar a assinatura e extrair os dados do usuário.

---

## 2. Por que separar `UsuarioCreate` e `UsuarioLogin` se são iguais?

São iguais agora, mas no futuro `UsuarioCreate` pode ter campos extras como `nome`, `telefone`, etc. Separar desde o início evita refatoração futura.

---

## 3. Por que `response.user` e `response.session` podem ser `None`?

O Supabase pode retornar `None` em vários cenários:
- Email não confirmado: retorna `user` mas `session` é `None`
- Credenciais erradas: retorna `None` em ambos

Por isso sempre verificamos os dois antes de acessar:

```python
if response.user is None or response.session is None:
    raise HTTPException(status_code=401, detail="Credenciais inválidas")
```

---

## 4. O que é `or response.session is None` na validação?

É uma verificação encadeada. O `or` significa "ou". Se qualquer uma das condições for verdadeira, entra no bloco de erro:

```python
# se user for None OU se session for None, retorna erro
if response.user is None or response.session is None:
    raise HTTPException(...)
```

Isso garante que tanto o usuário quanto a sessão existem antes de acessar `.access_token`.

---

## 5. Por que desabilitar confirmação de email no Supabase durante desenvolvimento?

O fluxo de confirmação de email exige uma URL de callback no frontend para redirecionar o usuário após clicar no link. Como o frontend ainda não existe nesse estágio, desabilitar temporariamente evita bloquear o desenvolvimento.

Em produção, a confirmação de email é reativada e o callback configurado com a URL real do frontend.

No Supabase: **Authentication > Providers > Email > desativar "Confirm email"**

---

# Dúvidas — Bloco 06: Proteção de rotas

---

## 1. O que é Dependency Injection no FastAPI?

É um sistema onde você cria uma função que faz alguma verificação, e declara ela como dependência de uma rota. O FastAPI executa essa função automaticamente antes de cada requisição.

```python
def obter_usuario_atual(credenciais: HTTPAuthorizationCredentials = Depends(seguranca)):
    # valida o token e retorna o usuário
    ...

@router.get("/")
def listar_tarefas(usuario_atual=Depends(obter_usuario_atual)):
    # usuario_atual já vem validado, sem repetir a lógica aqui
    ...
```

Evita repetir a lógica de validação em cada rota.

---

## 2. O que é `HTTPBearer`?

É um utilitário do FastAPI que extrai automaticamente o token Bearer do header `Authorization` da requisição.

Quando o cliente manda:
```
Authorization: Bearer eyJhbGci...
```

O `HTTPBearer` captura e entrega o token em `credenciais.credentials`.

---

## 3. Por que o Pylance reclama do `response.user` mesmo com validação de `None`?

O Pylance analisa os tipos estaticamente e não consegue acompanhar o fluxo de execução em todos os casos. Mesmo com o `if response.user is None: raise ...`, ele ainda enxerga `response.user` como potencialmente `None` no `return`.

Isso acontece porque os stubs de tipo da biblioteca `supabase-py` estão incompletos — o tipo retornado por `get_user()` não está bem declarado.

Solução aceita nesses casos: `# type: ignore` na linha problemática.

```python
usuario = response.user  # type: ignore
```

`# type: ignore` não é gambiarra quando a biblioteca de terceiros tem tipagem incompleta. É a forma documentada de silenciar avisos em situações onde o código está correto mas o analisador não consegue verificar.

---

## 4. O que são RLS policies e por que sem elas tudo fica bloqueado?

RLS (Row Level Security) é uma camada de segurança do PostgreSQL. Quando ativado em uma tabela, ele bloqueia todas as operações por padrão.

As **policies** são as regras que definem quem pode fazer o quê. Sem nenhuma policy, o comportamento padrão é negar tudo, inclusive para usuários autenticados.

```sql
-- libera leitura para usuários autenticados
create policy "usuarios autenticados podem ler tarefas"
on public.tarefas
for select
to authenticated
using (true);
```

`to authenticated` — aplica a regra apenas para usuários com token válido.
`using (true)` — permite a operação sem restrição adicional de filtro.

---

## 5. Por que o cliente Supabase precisa do `postgrest.auth(token)` mesmo com RLS liberado?

O cliente Supabase usa a chave configurada no `.env` por padrão. Para o banco saber que a requisição vem de um usuário `authenticated`, você precisa passar o token JWT do usuário nas queries:

```python
supabase.postgrest.auth(credenciais.credentials)
response = supabase.table("tarefas").select("*").execute()
```

Sem isso, mesmo com policies criadas, o banco enxerga a requisição como `anon` ou `service_role`, não como o usuário autenticado.

---

## 6. Qual a diferença entre `anon`, `authenticated` e `service_role` no Supabase?

- **anon** — usuário não autenticado. Acesso mínimo, controlado por policies.
- **authenticated** — usuário com token JWT válido. Acesso definido pelas policies.
- **service_role** — acesso total, bypassa o RLS. Usado apenas no backend, nunca exposto no frontend ou GitHub.
