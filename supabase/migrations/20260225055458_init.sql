-- Enable vector extension for semantic search
create extension if not exists vector with schema extensions;

-- Chunks table: stores knowledge base content with embeddings
create table chunks (
  id bigserial primary key,
  content text not null,
  source_file text not null,
  source_type text not null,
  chunk_index integer not null,
  token_count integer,
  embedding vector(1536),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- HNSW index for fast similarity search
create index chunks_embedding_idx on chunks using hnsw (embedding vector_cosine_ops);

-- Function to find chunks similar to a query embedding
create or replace function match_chunks(
  query_embedding vector(1536),
  match_threshold float default 0.3,
  match_count int default 8
)
returns table (
  id bigint,
  content text,
  source_file text,
  source_type text,
  similarity float
)
language sql stable
as $$
  select
    chunks.id,
    chunks.content,
    chunks.source_file,
    chunks.source_type,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  where 1 - (chunks.embedding <=> query_embedding) > match_threshold
  order by chunks.embedding <=> query_embedding
  limit match_count;
$$;
