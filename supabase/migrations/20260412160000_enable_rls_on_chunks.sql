-- Resolves two Supabase security advisors:
--   ERROR: rls_disabled_in_public on public.chunks
--   WARN:  function_search_path_mutable on public.match_chunks
--
-- public.chunks is only read by /api/chat via the service role client,
-- which bypasses RLS. Enabling RLS with no policies blocks anon/authenticated
-- access without affecting the chatbot.

alter table public.chunks enable row level security;

alter function public.match_chunks(vector, double precision, integer)
  set search_path = public, extensions;
