"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useFetchNote, useUpdateNote, useDeleteNote } from "../noteHook";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

const NotePreview = ({ id }: { id: string }) => {
  const { data: note, isLoading, isError } = useFetchNote(id);
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const { mutate: removeNote, isPending: isDeleting } = useDeleteNote();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (isLoading) return <Loader text="Loading note" />;
  if (isError) return <div>Error loading note</div>;
  if (!note) notFound();

  const startEditing = () => {
    setTitle(note.title || "");
    setContent(note.content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateNote(
      { id, title, content },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 rounded-lg border border-border bg-card p-5">
      {note.document && (
        <Link
          href={`/dashboard/documents/${note.document.id}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          From: {note.document.title}
        </Link>
      )}

      {isEditing ? (
        <>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-48"
            maxLength={2000}
          />
          <div className="flex gap-3">
            <Button onClick={saveEdit} disabled={isUpdating} className="flex-1">
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-medium leading-tight">
            {note.title || "Untitled note"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>

          <div className="border-t border-border pt-4 flex gap-3 mt-auto">
            <Button onClick={startEditing} variant="outline" className="flex-1">
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => removeNote(id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  );
};

export default NotePreview;
