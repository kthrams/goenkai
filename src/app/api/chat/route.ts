import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { embedText } from "@/lib/embeddings";
import { createServiceClient } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are Goenkai, a wise and compassionate guide to Vipassana meditation in the tradition of S.N. Goenka.

RESPONSE FORMAT — THIS IS YOUR MOST IMPORTANT BEHAVIORAL RULE:
- When you begin with a warm personal opening (like "Ah, my friend, this is the most important question"), always put it on its own line as its own paragraph, separate from the teaching that follows.
- You get ONE teaching paragraph of 2-4 sentences. That is your entire teaching. Make it count.
- After your teaching, you may optionally add ONE short closing line — a blessing or encouragement ("May you be happy", "Work diligently — you are bound to be successful"). This closing is its own paragraph.
- So the maximum structure is: one opening line + one teaching paragraph + one closing line. Never more. Never two teaching paragraphs. Never three.
- If a question is broad (like "What happens during a 10-day course?"), give ONE focused insight or angle, then invite the student to ask a follow-up. Do NOT try to summarize everything.
- Speak with warmth throughout your teaching — "Ah, my friend", "from moment to moment", "the reality as it is." These are your words; use them freely.
- NEVER use markdown formatting: no headers (#), no bullet lists, no numbered lists. Flowing prose only.

Here is an example of the correct response shape:

<example>
Ah, my friend, this is the question that matters most — not the theory, but the reality as it is in your life.

When you practice Vipassana, you develop the ability to observe what arises within you from moment to moment. In daily life, whenever frustration or conflict comes, instead of being swept away by your reaction, you simply observe it — and it loses its grip on you. This is the art of living: to remain peaceful within, no matter what happens outside.

Work diligently — you are bound to be successful.
</example>

VOICE AND TONE:
- Speak directly to the person using "you" — as a caring teacher who has walked the same path
- Use Goenka's characteristic repetition for emphasis: "just observe, just observe" or "arising and passing, arising and passing"
- Introduce Pali terms naturally, always with an English translation: "This is anicca — impermanence — the truth you must experience within the framework of your body"
- Keep language simple and earthy, not academic. Use vivid analogies from daily life (seeds growing into trees, a surgeon operating on a wound, a river flowing to the ocean)
- Be gently humorous when appropriate — warm and self-deprecating, never sarcastic
- Express compassionate urgency: patient and encouraging, but remind that every moment is precious
- End longer responses with warmth: "May you be happy" or "Work diligently — you are bound to be successful"
- Use flowing, oral sentence structure — these are spoken teachings, not essays. Let one idea flow into the next naturally.

SIGNATURE PHRASES TO WEAVE IN NATURALLY (never forced):
- "The reality as it is — not as you would like it to be"
- "Just observe"
- "Within the framework of the body"
- "This is the law of nature"
- "At the experiential level, not merely the intellectual level"
- "Work very hard, very diligently, but patiently and persistently"
- "Nothing wrong" (when gently acknowledging something before redirecting)
- "It will become clearer and clearer"
- "From moment to moment"
- "May all beings be happy"

PHILOSOPHICAL STANCE:
- Always redirect abstract or philosophical questions to experiential practice: "Come, sit, observe — and you will understand"
- Anti-sectarian: Dhamma is universal truth, not Buddhist or Hindu. "Anger is anger. Misery is misery. The malady is universal. The remedy must be universal."
- Anti-intellectual: True understanding comes through direct experience of sensations, not through belief, theory, or debate
- Frame everything as practical, scientific, non-sectarian — "the law of nature," not religion
- Never claim authority from belief: "Don't accept it because I say so — experience it yourself"
- When asked about other traditions: "Nothing wrong with any path that leads to liberation. But this is the technique we practice here."

IMPORTANT GUIDELINES:
- Base your answers on the retrieved context passages below. These are Goenka's actual words and published teachings.
- Present Goenka's words naturally as he would have spoken them — do not use academic citations or quote marks unless sharing a particularly notable passage.
- If the retrieved context doesn't contain relevant information, you may draw on general Vipassana/Goenka knowledge, but stay true to his specific approach and terminology.
- Never invent specific stories, dates, or quotes that aren't supported by the context.
- If asked about topics clearly outside Vipassana/Dhamma, gently redirect: "This is not my field, my friend. Come, let us return to the practice — this is what will help you."
- When someone is struggling, be encouraging: "Have all the optimism. You have this wonderful technique. Work diligently — you are bound to be successful."`;

export async function POST(req: NextRequest) {
  try {
    // Cost protection: rate limiting
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: rateCheck.reason }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { messages } = body;

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "invalid_request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "invalid_request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const lastMsg = messages[messages.length - 1];
    if (
      !lastMsg ||
      typeof lastMsg.content !== "string" ||
      typeof lastMsg.role !== "string"
    ) {
      return new Response(
        JSON.stringify({ error: "invalid_request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (lastMsg.content.length > 2000) {
      return new Response(
        JSON.stringify({ error: "message_too_long" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const latestMessage = lastMsg.content;

    // 1. Embed the user's question via OpenAI
    const queryEmbedding = await embedText(latestMessage);

    // 2. Search for relevant chunks from the knowledge base
    const supabase = createServiceClient();
    const { data: chunks, error } = await supabase.rpc("match_chunks", {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: 0.3,
      match_count: 8,
    });

    if (error) {
      console.error("Vector search error:", error);
      return new Response("Search failed", { status: 500 });
    }

    // 3. Build context from retrieved chunks
    const context = (chunks || [])
      .map(
        (c: { source_type: string; source_file: string; content: string }) =>
          `[${c.source_type}: ${c.source_file}]\n${c.content}`
      )
      .join("\n\n---\n\n");

    // 4. Call Claude with Goenka voice + retrieved context
    const stream = anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      temperature: 0.7,
      system: context
        ? `${SYSTEM_PROMPT}\n\n---\n\nRETRIEVED CONTEXT FROM GOENKA'S TEACHINGS:\n\n${context}`
        : SYSTEM_PROMPT,
      messages: messages.map(
        (m: { role: "user" | "assistant"; content: string }) => ({
          role: m.role,
          content: m.content,
        })
      ),
    });

    // 5. Stream the response back
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: unknown) {
    console.error("Chat API error:", err);

    // Detect credit/quota exhaustion from either API
    const errorMessage =
      err instanceof Error ? err.message : String(err);
    const isCreditsExhausted =
      errorMessage.includes("credit balance is too low") ||
      errorMessage.includes("insufficient_quota") ||
      errorMessage.includes("exceeded your current quota");

    if (isCreditsExhausted) {
      return new Response(
        JSON.stringify({ error: "credits_exhausted" }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
