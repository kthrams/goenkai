"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

function formatContent(text: string) {
  // Split into paragraphs and detect quoted lines (starting with ")
  return text.split("\n\n").map((paragraph, i) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    // Detect quotes — lines wrapped in "..." or starting with "
    const isQuote =
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("\u201C") && trimmed.endsWith("\u201D"));

    if (isQuote) {
      return (
        <blockquote
          key={i}
          className="my-2 border-l-2 border-primary/40 pl-4 italic text-foreground/80"
        >
          {trimmed}
        </blockquote>
      );
    }

    return (
      <p key={i} className={i > 0 ? "mt-3" : ""}>
        {trimmed}
      </p>
    );
  });
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isBot = role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-5 py-4 leading-relaxed shadow-sm",
          isBot
            ? "max-w-[75%] rounded-tl-sm bg-chat-bot text-foreground"
            : "max-w-[85%] rounded-tr-sm bg-chat-user text-foreground"
        )}
        style={{ lineHeight: "1.75" }}
      >
        <div className="whitespace-pre-wrap text-[15px]">
          {isBot ? formatContent(content) : content}
        </div>
      </div>
    </div>
  );
}
