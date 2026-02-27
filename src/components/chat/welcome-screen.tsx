"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onSuggestionClick: (message: string) => void;
  inputSlot: ReactNode;
}

const suggestions = [
  "Explain the benefits of Vipassana meditation",
  "What happens during a 10-day course?",
  "I'm struggling to keep up my practice",
  "How will this help me in my day-to-day life?",
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
          className="mb-3 font-serif text-4xl font-medium tracking-tight text-foreground"
        >
          Goenk<span className="text-primary/70">ai</span>
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
          This is an AI — responses are inspired by Goenka&apos;s teachings but may contain inaccuracies.
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
