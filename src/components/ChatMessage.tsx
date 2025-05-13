import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useEffect, useRef } from "react";

export function ChatMessage({ message, isLast }: { message: Message; isLast: boolean }) {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLast && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLast]);

  return (
    <div
      ref={messageRef}
      className={cn(
        "px-4 py-6 animate-message-fade",
        message.role === "user" ? "bg-blue-50" : "bg-white"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0",
            message.role === "user" ? "bg-chat-user" : "bg-chat-ai"
          )}
        >
          {message.role === "user" ? "U" : "AI"}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}