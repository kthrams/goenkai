"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-chat-bot rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="bg-muted-foreground/40 h-2 w-2 animate-pulse rounded-full [animation-duration:1.4s]" />
          <span className="bg-muted-foreground/40 h-2 w-2 animate-pulse rounded-full [animation-delay:0.2s] [animation-duration:1.4s]" />
          <span className="bg-muted-foreground/40 h-2 w-2 animate-pulse rounded-full [animation-delay:0.4s] [animation-duration:1.4s]" />
        </div>
      </div>
    </div>
  );
}
