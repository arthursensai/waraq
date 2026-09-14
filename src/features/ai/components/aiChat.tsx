"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useAskAi } from "../aiHook";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const AiChat = ({ documentId }: { documentId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { mutate: askAi, isPending } = useAskAi();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const sendMessage = () => {
    const question = input.trim();
    if (!question || isPending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    askAi(
      { documentId, question },
      {
        onSuccess: (answer) => {
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "ai", content: answer },
          ]);
        },
      },
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href={`/dashboard/documents/${documentId}/read`}>
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Ask AI about this document</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <p className="mx-auto max-w-md text-center text-sm text-muted-foreground">
            Ask a question about this document's title, description, author, or
            content — for example, "What is this book about?" or "Who is the
            author?"
          </p>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Spinner className="size-3.5" />
                Thinking…
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this document..."
          className="min-h-11 flex-1 resize-none"
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isPending || !input.trim()}
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

export default AiChat;
