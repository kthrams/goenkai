"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

function formatInline(text: string): React.ReactNode[] {
  // Parse **bold** and *italic* markdown
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // **bold**
      parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={match.index}>{match[3]}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function formatContent(text: string) {
  // Split into paragraphs and detect quoted lines (starting with ")
  return text.split("\n\n").map((paragraph, i) => {
    // Strip markdown headers (# Header → Header)
    const trimmed = paragraph.trim().replace(/^#{1,6}\s+/, "");
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
          {formatInline(trimmed)}
        </blockquote>
      );
    }

    return (
      <p key={i} className={i > 0 ? "mt-3" : ""}>
        {formatInline(trimmed)}
      </p>
    );
  });
}

/** Render each character as an individually-fading span */
function renderCharFade(content: string) {
  return content.split("").map((char, i) => (
    <span key={i} className="stream-char-fade">
      {char}
    </span>
  ));
}

export function ChatMessage({ role, content, streaming }: ChatMessageProps) {
  const isBot = role === "assistant";

  let renderedContent: React.ReactNode;
  if (isBot && streaming) {
    renderedContent = renderCharFade(content);
  } else {
    renderedContent = isBot ? formatContent(content) : content;
  }

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
          {renderedContent}
        </div>
      </div>
    </div>
  );
}
