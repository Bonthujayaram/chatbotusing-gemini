import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { Message } from "@/types/chat";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyATkTuP78gpgWTOuRQFHFfWAgEr0gRGsBQ");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(content);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        role: "assistant",
        content: text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from Gemini. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-center">Gemini Chat Assistant</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Start a conversation by sending a message below
          </div>
        ) : (
          messages.map((message, i) => (
            <ChatMessage
              key={i}
              message={message}
              isLast={i === messages.length - 1}
            />
          ))
        )}
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}