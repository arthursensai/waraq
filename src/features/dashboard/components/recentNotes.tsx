"use client";

import Link from "next/link";
import { StickyNote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchNotes } from "../../note/noteHook";

const RecentNotes = () => {
  const { data: notes, isLoading } = useFetchNotes();
  const recent = (notes ?? []).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}

        {!isLoading && recent.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">No notes yet.</p>
        )}

        {!isLoading &&
          recent.map((note) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="flex items-start gap-3 py-2 border-b border-border last:border-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition-colors"
            >
              <StickyNote className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">
                  {note.title || "Untitled note"}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {note.content}
                </p>
              </div>
            </Link>
          ))}
      </CardContent>
    </Card>
  );
};

export default RecentNotes;
