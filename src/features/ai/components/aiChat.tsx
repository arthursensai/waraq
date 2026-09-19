"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
useAskAi,
useChatHistory,
useClearChatHistory,
useDocumentRagStatus,
} from "../aiHook";

type ChatMessage = {
id: string;
role: "user" | "ai";
content: string;
};

const AiChat = ({ documentId }: { documentId: string }) => {
const { data: history, isLoading: isHistoryLoading } =
useChatHistory(documentId);
const { data: ragStatus } = useDocumentRagStatus(documentId);
const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
const [input, setInput] = useState("");
const { mutate: askAi, isPending } = useAskAi();
const { mutate: clearHistory, isPending: isClearing } =
useClearChatHistory();
const bottomRef = useRef<HTMLDivElement>(null);

// Once the history refetches after a successful ask, the confirmed
// question/answer pair now lives in "history" — drop the optimistic
// copies so nothing is shown twice.
useEffect(() => {
setPendingMessages([]);
}, [history]);

const messages: ChatMessage[] = [...(history ?? []), ...pendingMessages];

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages.length, isPending]);

const sendMessage = () => {
const question = input.trim();
if (!question || isPending) return;

const userMessage: ChatMessage = {
  id: crypto.randomUUID(),
  role: "user",
  content: question,
};

setPendingMessages((prev) => [...prev, userMessage]);
setInput("");

askAi(
  { documentId, question },
  {
    onSuccess: (answer) => {
      setPendingMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content: answer,
        },
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
<div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
<div className="flex items-center gap-3">
<Button variant="ghost" size="icon-sm" asChild>
<Link href={"/dashboard/documents/${documentId}/read"}>
<ArrowLeft size={16} />
</Link>
</Button>

      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium">
          Ask AI about this document
        </span>
      </div>
    </div>

    {messages.length > 0 && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isClearing}
            title="Clear chat history"
          >
            <Trash2 size={16} />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear chat history?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete your conversation about this
              document. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => clearHistory(documentId)}
              disabled={isClearing}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )}
  </div>

  {(ragStatus === "pending" || ragStatus === "processing") && (
    <div className="border-b border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
      Indexing this document&apos;s content for deeper answers — you can
      keep chatting in the meantime using its title and description.
    </div>
  )}

  {ragStatus === "failed" && (
    <div className="border-b border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
      Couldn&apos;t fully index this document&apos;s content; answers will
      rely on its title and description only.
    </div>
  )}

  {/* Messages */}
  <div className="flex-1 overflow-y-auto px-4 py-6">
    {isHistoryLoading && (
      <div className="flex justify-center py-6">
        <Spinner className="size-4" />
      </div>
    )}

    {!isHistoryLoading && messages.length === 0 && (
      <p className="mx-auto max-w-md text-center text-sm text-muted-foreground">
        Ask a question about this document&apos;s title, description,
        author, or content — for example, &quot;What is this book
        about?&quot; or &quot;Who is the author?&quot;
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
