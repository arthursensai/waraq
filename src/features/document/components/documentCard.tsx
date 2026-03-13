import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocumentType } from "../documentSchema";

interface Document extends DocumentType {
  author_name: string;
}

interface AuthorPreviewProps {
  document: Document;
}

const DocumentCard = ({ document }: AuthorPreviewProps) => {
  const { id, title, author_name, description } = document;

  return (
    <Link
      href={`/dashboard/documents/${id}`}
      className="group aspect-[3/4] w-full flex flex-col border border-border hover:border-border/80 transition-all duration-300 rounded-xl overflow-hidden cursor-pointer bg-card"
    >
      {/* Image area */}
      <div className="flex-1 relative bg-muted/20 overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
            {title.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-center text-sm font-semibold line-clamp-3 text-foreground">
            {title}
          </h3>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between gap-3 bg-card">
        {description ? (
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/50 italic flex-1">
            No biography yet
          </p>
        )}
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default DocumentCard;
