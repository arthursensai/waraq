"use client";

import { StickyNote } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFetchNotes } from "../noteHook";
import NoteCard from "./noteCard";

const NotesPreview = () => {
  const { data: notes, isLoading, isError } = useFetchNotes();

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader text="Loading Notes" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <p className="text-destructive text-sm font-medium">
          Failed to load notes
        </p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (!notes?.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <StickyNote className="size-10 opacity-40" />
        <p className="field-legend">No notes yet</p>
        <Button asChild variant="link">
          <Link href="/dashboard/notes/new">Write your first note</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full content-start">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesPreview;
