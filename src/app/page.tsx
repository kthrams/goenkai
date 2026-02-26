"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { WelcomeScreen } from "@/components/chat/welcome-screen";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}


export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    const allMessages = [...messages, userMessage];
    setMessages(allMessages);
    setIsTyping(true);

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
      let botContent = "";

      // Switch from typing dots to streaming text
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: botMessageId, role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botContent += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId ? { ...m, content: botContent } : m
          )
        );
      }
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
          className="font-serif text-lg font-medium tracking-tight text-foreground transition-opacity duration-200 hover:opacity-70"
        >
          Goenk<span className="text-primary/70">ai</span>
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
