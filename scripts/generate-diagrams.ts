/**
 * Generates Excalidraw diagram files for project documentation.
 * Run with: npx tsx scripts/generate-diagrams.ts
 *
 * Output: docs/diagrams/*.excalidraw
 * Open files at excalidraw.com (drag & drop) or with the Obsidian Excalidraw plugin.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DIAGRAMS_DIR = join(process.cwd(), "docs", "diagrams");
mkdirSync(DIAGRAMS_DIR, { recursive: true });

let idCounter = 0;
const nextId = () => `el${String(++idCounter).padStart(3, "0")}`;
const randomSeed = () => Math.floor(Math.random() * 2_000_000_000);

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    seed: randomSeed(),
    version: 1,
    versionNonce: randomSeed(),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    ...overrides,
  };
}

function createBox(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { label?: string; bg?: string; fontSize?: number } = {}
) {
  const rectId = nextId();
  const textId = opts.label ? nextId() : undefined;
  const elements: Record<string, unknown>[] = [];

  elements.push({
    ...baseProps(),
    id: rectId,
    type: "rectangle",
    x,
    y,
    width: w,
    height: h,
    backgroundColor: opts.bg || "transparent",
    roundness: { type: 3 },
    boundElements: textId ? [{ id: textId, type: "text" }] : null,
  });

  if (opts.label && textId) {
    const fs = opts.fontSize || 20;
    const lines = opts.label.split("\n");
    const lh = fs * 1.25;
    const tw = Math.max(...lines.map((l) => l.length)) * fs * 0.55;
    const th = lines.length * lh;

    elements.push({
      ...baseProps(),
      id: textId,
      type: "text",
      x: x + (w - tw) / 2,
      y: y + (h - th) / 2,
      width: tw,
      height: th,
      text: opts.label,
      fontSize: fs,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: rectId,
      originalText: opts.label,
      lineHeight: 1.25,
      roundness: null,
    });
  }

  return { rectId, textId, elements };
}

function createText(
  x: number,
  y: number,
  text: string,
  opts: {
    fontSize?: number;
    color?: string;
    align?: string;
    fontFamily?: number;
  } = {}
) {
  const elemId = nextId();
  const fs = opts.fontSize || 16;
  const lines = text.split("\n");
  const lh = fs * 1.25;
  const tw = Math.max(...lines.map((l) => l.length)) * fs * 0.55;
  const th = lines.length * lh;

  return {
    id: elemId,
    elements: [
      {
        ...baseProps(),
        id: elemId,
        type: "text",
        x,
        y,
        width: tw,
        height: th,
        text,
        fontSize: fs,
        fontFamily: opts.fontFamily || 1,
        textAlign: opts.align || "left",
        verticalAlign: "top",
        containerId: null,
        originalText: text,
        lineHeight: 1.25,
        roundness: null,
        strokeColor: opts.color || "#1e1e1e",
      },
    ],
  };
}

function createArrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts: { startId?: string; endId?: string; label?: string } = {}
) {
  const arrowId = nextId();
  const elements: Record<string, unknown>[] = [];

  elements.push({
    ...baseProps(),
    id: arrowId,
    type: "arrow",
    x: x1,
    y: y1,
    width: Math.abs(x2 - x1) || 1,
    height: Math.abs(y2 - y1) || 1,
    points: [
      [0, 0],
      [x2 - x1, y2 - y1],
    ],
    startBinding: opts.startId
      ? { elementId: opts.startId, focus: 0, gap: 5 }
      : null,
    endBinding: opts.endId
      ? { elementId: opts.endId, focus: 0, gap: 5 }
      : null,
    startArrowhead: null,
    endArrowhead: "arrow",
    roundness: { type: 2 },
    lastCommittedPoint: null,
  });

  if (opts.label) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const label = createText(midX - 30, midY - 22, opts.label, {
      fontSize: 13,
      color: "#868e96",
    });
    elements.push(...label.elements);
  }

  return { id: arrowId, elements };
}

function toExcalidrawFile(elements: Record<string, unknown>[]) {
  return {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements,
    appState: { viewBackgroundColor: "#ffffff", gridSize: null },
    files: {},
  };
}

// ────────────────────────────────────────────────────────────
// Diagram 1: System Architecture
// ────────────────────────────────────────────────────────────

function buildSystemArchitecture() {
  const els: Record<string, unknown>[] = [];

  // Title
  els.push(
    ...createText(300, 20, "Goenkai — System Architecture", { fontSize: 28 })
      .elements
  );

  // Browser
  const browser = createBox(60, 220, 200, 100, {
    label: "Browser\n(React)",
    bg: "#d0bfff",
  });
  els.push(...browser.elements);

  // API container
  const api = createBox(370, 120, 280, 320, { bg: "#fff9db" });
  els.push(...api.elements);
  els.push(
    ...createText(400, 130, "Next.js — /api/chat", { fontSize: 18 }).elements
  );

  // Steps inside API box
  const steps = [
    "1. Rate limit check",
    "2. Embed question",
    "3. Vector search",
    "4. Build prompt",
    "5. Generate (Claude)",
    "6. Stream response",
  ];
  steps.forEach((step, i) => {
    els.push(...createText(395, 175 + i * 38, step, { fontSize: 14 }).elements);
  });

  // External services
  const openai = createBox(770, 140, 220, 70, {
    label: "OpenAI\nEmbeddings",
    bg: "#a5d8ff",
    fontSize: 16,
  });
  els.push(...openai.elements);

  const supabase = createBox(770, 260, 220, 70, {
    label: "Supabase\npgvector (4,936 chunks)",
    bg: "#b2f2bb",
    fontSize: 14,
  });
  els.push(...supabase.elements);

  const anthropic = createBox(770, 380, 220, 70, {
    label: "Anthropic\nClaude Haiku",
    bg: "#ffd8a8",
    fontSize: 16,
  });
  els.push(...anthropic.elements);

  // Arrows
  els.push(
    ...createArrow(260, 270, 370, 270, {
      startId: browser.rectId,
      endId: api.rectId,
    }).elements
  );
  els.push(...createArrow(650, 175, 770, 175, { label: "embed" }).elements);
  els.push(...createArrow(650, 295, 770, 295, { label: "search" }).elements);
  els.push(...createArrow(650, 415, 770, 415, { label: "generate" }).elements);

  return toExcalidrawFile(els);
}

// ────────────────────────────────────────────────────────────
// Diagram 2: Prompt Structure
// ────────────────────────────────────────────────────────────

function buildPromptStructure() {
  const els: Record<string, unknown>[] = [];
  const LEFT = 120;
  const W = 380;
  let y = 30;

  els.push(
    ...createText(LEFT + 30, y, "System Prompt Structure", { fontSize: 28 })
      .elements
  );
  y += 60;

  const sections = [
    {
      label: "RESPONSE FORMAT",
      bg: "#ffc9c9",
      h: 55,
      note: "Brevity rules — position 1\n(strongest compliance)",
    },
    {
      label: "Few-shot Example",
      bg: "#ffd8a8",
      h: 50,
      note: "Complete model response\nshowing target format/length",
    },
    {
      label: "VOICE AND TONE",
      bg: "#fff9db",
      h: 50,
      note: "Direct address, Pali terms,\nrepetition patterns",
    },
    {
      label: "SIGNATURE PHRASES",
      bg: "#fff9db",
      h: 45,
      note: '"The reality as it is"\n"Just observe"',
    },
    {
      label: "PHILOSOPHICAL STANCE",
      bg: "#d0ebff",
      h: 45,
      note: "Anti-sectarian, experiential\nRedirects to practice",
    },
    {
      label: "GUIDELINES",
      bg: "#d0ebff",
      h: 45,
      note: "Use context, cite naturally\nStay on topic",
    },
    {
      label: "RETRIEVED CONTEXT",
      bg: "#b2f2bb",
      h: 60,
      note: "8 chunks injected at runtime\nfrom vector search",
    },
  ];

  sections.forEach((s) => {
    const box = createBox(LEFT, y, W, s.h, {
      label: s.label,
      bg: s.bg,
      fontSize: 15,
    });
    els.push(...box.elements);

    const note = createText(LEFT + W + 30, y + 8, s.note, {
      fontSize: 12,
      color: "#868e96",
    });
    els.push(...note.elements);

    y += s.h + 6;
  });

  // Priority arrow on the left
  const arrowTop = 90;
  const arrowBottom = y - 10;
  els.push(
    ...createArrow(LEFT - 50, arrowTop, LEFT - 50, arrowBottom).elements
  );

  const priorityLabel = createText(
    LEFT - 125,
    (arrowTop + arrowBottom) / 2 - 20,
    "Higher\npriority",
    { fontSize: 14, color: "#e03131", align: "center" }
  );
  els.push(...priorityLabel.elements);

  return toExcalidrawFile(els);
}

// ────────────────────────────────────────────────────────────
// Diagram 3: Ingestion Pipeline
// ────────────────────────────────────────────────────────────

function buildIngestionPipeline() {
  const els: Record<string, unknown>[] = [];
  let y = 30;

  els.push(
    ...createText(250, y, "Knowledge Base Ingestion", { fontSize: 28 }).elements
  );
  y += 70;

  const centerX = 350;
  const boxW = 300;
  const boxH = 70;
  const gap = 40;

  const steps = [
    { label: "Source Files\n130+ files, 1.37M words", bg: "#d0bfff" },
    { label: "Paragraph-Aware Chunking\n2,000 char max", bg: "#a5d8ff" },
    { label: "Batch Embedding\nOpenAI, 10 chunks/call", bg: "#fff9db" },
    {
      label: "Supabase Storage\n4,936 chunks + HNSW index",
      bg: "#b2f2bb",
    },
  ];

  const annotations = [
    ".md, .txt from books,\ndiscourses, Q&A collections",
    "Split on paragraphs then\nsentences. Filter < 80 chars",
    "text-embedding-3-small\n1,536 dimensions per chunk",
    "pgvector cosine distance\nReady for similarity search",
  ];

  steps.forEach((step, i) => {
    const box = createBox(centerX - boxW / 2, y, boxW, boxH, {
      label: step.label,
      bg: step.bg,
      fontSize: 15,
    });
    els.push(...box.elements);

    const note = createText(centerX + boxW / 2 + 40, y + 12, annotations[i], {
      fontSize: 12,
      color: "#868e96",
    });
    els.push(...note.elements);

    if (i < steps.length - 1) {
      els.push(
        ...createArrow(centerX, y + boxH, centerX, y + boxH + gap).elements
      );
    }

    y += boxH + gap;
  });

  return toExcalidrawFile(els);
}

// ────────────────────────────────────────────────────────────
// Generate all diagrams
// ────────────────────────────────────────────────────────────

const diagrams = [
  { name: "system-architecture", build: buildSystemArchitecture },
  { name: "prompt-structure", build: buildPromptStructure },
  { name: "ingestion-pipeline", build: buildIngestionPipeline },
];

for (const { name, build } of diagrams) {
  const filePath = join(DIAGRAMS_DIR, `${name}.excalidraw`);
  writeFileSync(filePath, JSON.stringify(build(), null, 2));
  console.log(`Created ${filePath}`);
}
