-- Run this in the Supabase SQL Editor to set up the RAG (retrieval-augmented
-- generation) system for the AI chat: pgvector storage for document chunks,
-- progress tracking on documents, a similarity-search RPC, and a pg_cron job
-- that drives background processing for free (no external queue needed).
--
-- ASSUMPTION: this assumes public.documents has a `user_id uuid` column
-- (the owner of the document), following the same convention as
-- public.notes and public.ai_chat_messages. If your documents table uses a
-- different column name for ownership, adjust every `d.user_id` /
-- `documents.user_id` reference below before running this.

-- 1. Extensions -----------------------------------------------------------
create extension if not exists vector;
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Progress tracking on documents ----------------------------------------
alter table public.documents
  add column if not exists rag_status text not null default 'pending',
  add column if not exists rag_progress_page int not null default 0,
  add column if not exists rag_error text;

alter table public.documents
  drop constraint if exists documents_rag_status_check;
alter table public.documents
  add constraint documents_rag_status_check
  check (rag_status in ('pending', 'processing', 'ready', 'failed'));

-- 3. document_chunks table --------------------------------------------------
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chunk_index int not null,
  page_number int,
  content text not null,
  embedding vector(768),
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_document_id_idx
  on public.document_chunks(document_id);

-- ivfflat speeds up similarity search once you have a meaningful number of
-- rows; harmless (just unused) while the table is small.
create index if not exists document_chunks_embedding_idx
  on public.document_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table public.document_chunks enable row level security;

drop policy if exists "Users can view their own document chunks" on public.document_chunks;
create policy "Users can view their own document chunks"
  on public.document_chunks for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own document chunks" on public.document_chunks;
create policy "Users can insert their own document chunks"
  on public.document_chunks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own document chunks" on public.document_chunks;
create policy "Users can delete their own document chunks"
  on public.document_chunks for delete
  using (auth.uid() = user_id);

-- 4. Similarity search RPC --------------------------------------------------
-- security invoker (the default) means auth.uid() reflects the calling
-- user, so this is safe to call from the client with the anon/authenticated
-- key — RLS-equivalent filtering happens right in the query.
create or replace function public.match_document_chunks(
  query_embedding vector(768),
  match_document_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  page_number int,
  similarity float
)
language sql
stable
as $$
  select
    document_chunks.id,
    document_chunks.content,
    document_chunks.page_number,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from public.document_chunks
  where document_chunks.document_id = match_document_id
    and document_chunks.user_id = auth.uid()
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;

-- 5. Background processing schedule -----------------------------------------
-- Calls your deployed app once a minute to advance any document still being
-- indexed. It only does real work when there's a pending/processing
-- document, so idle minutes are cheap no-ops.
--
-- Replace both placeholders below, then run this block once:
--   <YOUR_APP_URL>    e.g. https://waraq.vercel.app
--   <YOUR_CRON_SECRET> the same value you set for CRON_SECRET in Vercel
select cron.schedule(
  'process-rag-queue',
  '* * * * *',
  $$
  select net.http_post(
    url := '<YOUR_APP_URL>/api/cron/process-rag',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <YOUR_CRON_SECRET>'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- To check on it later:
--   select * from cron.job;
--   select * from cron.job_run_details order by start_time desc limit 20;
-- To remove it:
--   select cron.unschedule('process-rag-queue');
