"use client";

import { ReactNode } from "react";

interface WelcomeScreenProps {
  onSuggestionClick: (message: string) => void;
  inputSlot: ReactNode;
}

const suggestions = [
  { label: "Benefits of Vipassana", message: "Explain the benefits of Vipassana meditation" },
  { label: "What's a 10-day course?", message: "What happens during a 10-day course?" },
  { label: "Keeping up my practice", message: "I'm struggling to keep up my practice" },
  { label: "Vipassana in daily life", message: "How will this help me in my day-to-day life?" },
];

export function WelcomeScreen({
  onSuggestionClick,
  inputSlot,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        {/* Brand name in serif */}
        <h1 className="mb-3 font-serif text-4xl font-medium tracking-tight text-foreground">
          Goenk<span className="text-primary/70">ai</span>
        </h1>
        <p className="mb-10 text-[15px] leading-relaxed text-muted-foreground">
          A contemplative companion grounded in the teachings of S.N. Goenka.
          Ask a question about Vipassana meditation.
        </p>

        {/* Input */}
        <div className="mt-8">{inputSlot}</div>

        {/* Suggestion chips — flowing pills */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => onSuggestionClick(s.message)}
              className="rounded-full bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
