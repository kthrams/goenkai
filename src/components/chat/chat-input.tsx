"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  inline?: boolean;
}

export function ChatInput({ onSend, disabled, inline }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className={inline ? "px-4 py-4" : "border-border/60 bg-background/80 border-t px-4 py-4 backdrop-blur-sm"}>
      <div className="mx-auto flex max-w-2xl items-end gap-3">
        <div className="bg-card border-border/60 flex min-h-[48px] flex-1 items-center rounded-2xl border px-5 shadow-sm transition-shadow duration-300 focus-within:shadow-md focus-within:ring-1 focus-within:ring-ring/30">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ask about the teachings..."
            rows={1}
            disabled={disabled}
            className="max-h-[160px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="mb-[1px] flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md disabled:opacity-30 disabled:hover:shadow-sm"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
