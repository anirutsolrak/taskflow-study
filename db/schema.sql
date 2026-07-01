-- ============================================================
-- CATNotes — schema do backend (Supabase / PostgreSQL)
-- ============================================================
-- Para recriar o backend do zero:
--   1. Crie um projeto novo no Supabase.
--   2. Rode este arquivo no SQL Editor.
--   3. No .env do backend (app/) defina:
--        SUPABASE_URL=https://<seu-projeto>.supabase.co
--        SUPABASE_KEY=<service_role ou anon key>
--   4. No .env.local do frontend (taskflow-front/) defina:
--        NEXT_PUBLIC_API_URL=http://localhost:8000
--
-- Autenticacao (login/registro) usa o Supabase Auth (schema `auth`,
-- tabela auth.users), que ja vem gerenciado pelo Supabase — nao
-- precisa recriar nada aqui para isso funcionar.
-- ============================================================

create table if not exists tarefas (
  id           uuid        not null default gen_random_uuid(),
  titulo       text        not null,
  concluida    boolean     not null default false,
  criado_em    timestamptz not null default now(),
  tag          text,
  concluida_em timestamptz,
  constraint tarefas_pkey primary key (id)
);
