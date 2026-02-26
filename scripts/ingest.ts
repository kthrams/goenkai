import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env.local") });

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import fs from "fs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SOURCES_DIR = path.join(__dirname, "../sources");
const CHUNK_MAX_CHARS = 2000;
const MIN_CHUNK_CHARS = 80;
const BATCH_SIZE = 10;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function getSourceType(relativePath: string): string {
  if (relativePath.startsWith("discourses-public")) return "discourse-public";
  if (relativePath.startsWith("discourses")) return "discourse";
  if (relativePath.startsWith("books-archive")) return "book-archive";
  if (relativePath.startsWith("books")) return "book";
  if (relativePath.startsWith("qa-")) return "qa";
  return "other";
}

function chunkText(text: string): string[] {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const combined = current ? current + "\n\n" + para : para;

    if (combined.length > CHUNK_MAX_CHARS && current) {
      chunks.push(current.trim());
      if (para.length > CHUNK_MAX_CHARS) {
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        let sentenceChunk = "";
        for (const sentence of sentences) {
          const combined2 = sentenceChunk
            ? sentenceChunk + " " + sentence
            : sentence;
          if (combined2.length > CHUNK_MAX_CHARS && sentenceChunk) {
            chunks.push(sentenceChunk.trim());
            sentenceChunk = sentence;
          } else {
            sentenceChunk = combined2;
          }
        }
        current = sentenceChunk;
      } else {
        current = para;
      }
    } else {
      current = combined;
    }
  }

  if (current.trim()) chunks.push(current.trim());

  // Safety: truncate any chunk that's still too long for the embedding API
  // OpenAI's text-embedding-3-small has an 8191 token limit per text
  const MAX_SAFE_CHARS = 6000; // ~1500 tokens, well under the limit
  const result: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length > MAX_SAFE_CHARS) {
      // Split oversized chunks
      for (let i = 0; i < chunk.length; i += MAX_SAFE_CHARS) {
        const piece = chunk.slice(i, i + MAX_SAFE_CHARS).trim();
        if (piece.length >= MIN_CHUNK_CHARS) result.push(piece);
      }
    } else if (chunk.length >= MIN_CHUNK_CHARS) {
      result.push(chunk);
    }
  }
  return result;
}

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (
      entry.name.endsWith(".md") ||
      entry.name.endsWith(".txt") ||
      entry.name.endsWith(".text")
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}

async function main() {
  console.log("Finding source files...");
  const files = getFiles(SOURCES_DIR);
  console.log(`Found ${files.length} files\n`);

  if (files.length === 0) {
    console.error("No source files found!");
    process.exit(1);
  }

  const { error: deleteError } = await supabase
    .from("chunks")
    .delete()
    .neq("id", 0);
  if (deleteError) {
    console.error("Failed to clear existing chunks:", deleteError);
    process.exit(1);
  }
  console.log("Cleared existing chunks\n");

  let totalChunks = 0;
  let totalFiles = 0;
  let batch: {
    content: string;
    source_file: string;
    source_type: string;
    chunk_index: number;
    token_count: number;
  }[] = [];

  async function flushBatch() {
    if (batch.length === 0) return;

    try {
      const texts = batch.map((b) => b.content);
      const embeddings = await embedBatch(texts);

      const rows = batch.map((b, j) => ({
        ...b,
        embedding: JSON.stringify(embeddings[j]),
      }));

      const { error } = await supabase.from("chunks").insert(rows);
      if (error) console.error("Insert error:", error.message);

      totalChunks += batch.length;
    } catch {
      // Batch failed — fall back to one-at-a-time
      console.log(`\n  Batch failed, embedding individually...`);
      for (const b of batch) {
        try {
          const [embedding] = await embedBatch([b.content]);
          const { error } = await supabase.from("chunks").insert([{
            ...b,
            embedding: JSON.stringify(embedding),
          }]);
          if (!error) totalChunks++;
          else console.error(`  Skip (db): ${b.source_file}`);
        } catch {
          console.error(`  Skip (too long): ${b.source_file} chunk ${b.chunk_index} (${b.content.length} chars)`);
        }
      }
    }

    batch = [];
  }

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    if (content.trim().length === 0) continue;

    const relativePath = path.relative(SOURCES_DIR, file);
    const sourceType = getSourceType(relativePath);
    const chunks = chunkText(content);

    for (let i = 0; i < chunks.length; i++) {
      batch.push({
        content: chunks[i],
        source_file: relativePath,
        source_type: sourceType,
        chunk_index: i,
        token_count: estimateTokens(chunks[i]),
      });

      if (batch.length >= BATCH_SIZE) {
        await flushBatch();
        process.stdout.write(`\r  Processed ${totalChunks} chunks...`);
      }
    }

    totalFiles++;
  }

  await flushBatch();

  console.log(
    `\n\nDone! Ingested ${totalChunks} chunks from ${totalFiles} files.`
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
