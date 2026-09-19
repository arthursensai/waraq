-- Run this in the Supabase SQL Editor to create the ai_chat_messages table.

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  role text not null check (role in ('user', 'ai')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_chat_messages_user_document_idx
  on public.ai_chat_messages(user_id, document_id, created_at);

-- Row Level Security: each user can only see and manage their own chat history
alter table public.ai_chat_messages enable row level security;

drop policy if exists "Users can view their own ai chat messages" on public.ai_chat_messages;
create policy "Users can view their own ai chat messages"
  on public.ai_chat_messages for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ai chat messages" on public.ai_chat_messages;
create policy "Users can insert their own ai chat messages"
  on public.ai_chat_messages for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own ai chat messages" on public.ai_chat_messages;
create policy "Users can delete their own ai chat messages"
  on public.ai_chat_messages for delete
  using (auth.uid() = user_id);
