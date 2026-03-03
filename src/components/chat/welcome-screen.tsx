"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onSuggestionClick: (message: string) => void;
  inputSlot: ReactNode;
}

const suggestions = [
  "I want to be more balanced in life",
  "How do I stop arguing with others?",
  "I can't stop worrying about the future",
  "How do I deal with anxiety at work?",
];

const ease = [0.25, 0.4, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease },
  }),
};

export function WelcomeScreen({
  onSuggestionClick,
  inputSlot,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        {/* Brand name */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-3 flex items-center justify-center gap-[5px] font-serif text-4xl font-medium tracking-tight text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="h-8 w-8">
            <g transform="translate(16,16)">
              <ellipse cx="0" cy="-6.5" rx="3.2" ry="6.5" fill="currentColor" opacity="0.85" transform="rotate(0)"/>
              <ellipse cx="0" cy="-6.5" rx="3.2" ry="6.5" fill="currentColor" opacity="0.7" transform="rotate(60)"/>
              <ellipse cx="0" cy="-6.5" rx="3.2" ry="6.5" fill="currentColor" opacity="0.55" transform="rotate(120)"/>
              <ellipse cx="0" cy="-6.5" rx="3.2" ry="6.5" fill="currentColor" opacity="0.85" transform="rotate(180)"/>
              <ellipse cx="0" cy="-6.5" rx="3.2" ry="6.5" fill="currentColor" opacity="0.7" transform="rotate(240)"/>
              <ellipse cx="0" cy="-6.5" rx="3.2" ry="6.5" fill="currentColor" opacity="0.55" transform="rotate(300)"/>
              <circle cx="0" cy="0" r="2.5" fill="var(--background)"/>
              <circle cx="0" cy="0" r="1.5" fill="currentColor"/>
            </g>
          </svg>
          <span>Goenk<span className="text-primary/70">ai</span></span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="mb-2 text-[15px] leading-relaxed text-muted-foreground"
        >
          A contemplative companion grounded in the Vipassana teachings of S.N. Goenka.
        </motion.p>

        {/* AI disclaimer */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mb-10 text-[13px] text-muted-foreground/60"
        >
          This is an AI. Responses are inspired by Goenka&apos;s teachings but may contain inaccuracies.
        </motion.p>

        {/* Input */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-8"
        >
          {inputSlot}
        </motion.div>

        {/* Suggestion list */}
        <div className="mx-auto mt-3 w-full max-w-2xl px-4">
          {suggestions.map((question, i) => (
            <motion.button
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4 + i * 0.08}
              onClick={() => onSuggestionClick(question)}
              className="group w-full py-1.5 text-center text-[15px] text-muted-foreground/60 transition-colors duration-200 hover:text-foreground"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
