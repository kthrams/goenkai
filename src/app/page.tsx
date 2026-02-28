"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { WelcomeScreen } from "@/components/chat/welcome-screen";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}


// Words to render per tick — controls streaming speed
const WORDS_PER_TICK = 1;
const TICK_MS = 50; // ~20 words/sec, smooth word-by-word reveal

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Streaming throttle refs
  const bufferRef = useRef("");
  const displayedRef = useRef("");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeMessageIdRef = useRef<string | null>(null);

  const stopTicker = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTicker = useCallback((messageId: string) => {
    stopTicker();
    activeMessageIdRef.current = messageId;
    displayedRef.current = "";
    bufferRef.current = "";

    const streamDoneRef = { current: false };
    tickRef.current = setInterval(() => {
      const buf = bufferRef.current;
      const disp = displayedRef.current;

      if (disp.length < buf.length) {
        // Advance to the next WORDS_PER_TICK word boundaries
        let pos = disp.length;
        let wordsFound = 0;
        while (pos < buf.length && wordsFound < WORDS_PER_TICK) {
          // Skip whitespace
          while (pos < buf.length && /\s/.test(buf[pos])) pos++;
          // Skip word characters
          while (pos < buf.length && !/\s/.test(buf[pos])) pos++;
          wordsFound++;
        }
        const next = buf.slice(0, pos);
        displayedRef.current = next;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, content: next } : m
          )
        );
      } else if (streamDoneRef.current) {
        // Buffer fully displayed and stream is done — stop
        stopTicker();
        activeMessageIdRef.current = null;
      }
    }, TICK_MS);

    return streamDoneRef;
  }, [stopTicker]);

  // Signal that the stream has ended — ticker will stop once it catches up
  const markStreamDone = useCallback((streamDoneRef: { current: boolean }) => {
    streamDoneRef.current = true;
  }, []);

  // Scroll to bottom only on explicit triggers, never during streaming
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    const allMessages = [...messages, userMessage];
    setMessages(allMessages);
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        // Check for specific error types
        try {
          const errorData = await response.json();
          if (errorData.error === "credits_exhausted") {
            throw new Error("credits_exhausted");
          }
        } catch (e) {
          if (e instanceof Error && e.message === "credits_exhausted") throw e;
        }
        throw new Error("Chat request failed");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      const botMessageId = (Date.now() + 1).toString();

      // Switch from typing dots to streaming text
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: botMessageId, role: "assistant", content: "" },
      ]);
      scrollToBottom();

      // Start the throttled ticker
      const streamDoneRef = startTicker(botMessageId);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Feed chunks into the buffer; the ticker drips them out
        bufferRef.current += decoder.decode(value, { stream: true });
      }

      // Signal stream is done — ticker will stop once it catches up
      markStreamDone(streamDoneRef);
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);

      const isCredits =
        error instanceof Error && error.message === "credits_exhausted";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: isCredits
            ? "Goenkai is temporarily unavailable — this is a passion project and the AI credits have run out. If you'd like to help keep it running or just want to say hello, reach out to kevin.thrams@gmail.com. May you be happy."
            : "I'm sorry, something has gone wrong. Please try again, my friend.",
        },
      ]);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="border-border/60 flex items-center justify-center border-b px-6 py-3">
        <button
          onClick={() => {
            if (hasMessages) {
              setShowClearDialog(true);
            }
          }}
          className="flex items-center gap-1.5 font-serif text-lg font-medium tracking-tight text-foreground transition-opacity duration-200 hover:opacity-70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="h-5 w-5">
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
        </button>
      </header>

      {/* Clear chat confirmation dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Clear current chat?
              </h2>
              <button
                onClick={() => setShowClearDialog(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              To start a new chat, your current conversation will be discarded.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setMessages([]);
                  setShowClearDialog(false);
                }}
                className="rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Clear chat
              </button>
              <button
                onClick={() => setShowClearDialog(false)}
                className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat area */}
      <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto">
        {hasMessages ? (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        ) : (
          <WelcomeScreen
            onSuggestionClick={handleSend}
            inputSlot={<ChatInput onSend={handleSend} disabled={isTyping} inline />}
          />
        )}
      </div>

      {/* Input — only pinned to bottom during active chat */}
      {hasMessages && <ChatInput onSend={handleSend} disabled={isTyping} />}
    </div>
  );
}
