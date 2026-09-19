import Link from "next/link";
import { StickyNote } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string;
    title?: string | null;
    content: string;
    document?: { id: string; title: string } | null;
  };
}

const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <Link
      href={`/dashboard/notes/${note.id}`}
      className="group flex flex-col gap-3 border border-border hover:border-border/80 transition-all duration-300 rounded-xl p-4 bg-card"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <StickyNote className="w-4 h-4 shrink-0" />
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
          {note.title || "Untitled note"}
        </h3>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
        {note.content}
      </p>

      {note.document && (
        <span className="text-[11px] px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground w-fit line-clamp-1">
          {note.document.title}
        </span>
      )}
    </Link>
  );
};

export default NoteCard;
