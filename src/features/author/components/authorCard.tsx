import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AuthorPreviewProps {
  author: {
    full_name: string;
    image_url: string;
    biography: string;
    id: string;
  };
}

const AuthorCard = ({ author }: AuthorPreviewProps) => {
  const { full_name, image_url, biography, id } = author;

  return (
    <Link
      href={`/dashboard/authors/${id}`}
      className="group aspect-[3/4] w-full flex flex-col border border-border hover:border-border/80 transition-all duration-300 rounded-xl overflow-hidden cursor-pointer bg-card"
    >
      {/* Image area */}
      <div className="flex-1 relative bg-muted/20 overflow-hidden">
        {image_url ? (
          <>
            <Image
              src={image_url}
              alt={full_name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Name on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
                {full_name}
              </h3>
            </div>
          </>
        ) : (
          /* No image fallback */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {full_name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-center text-sm font-semibold line-clamp-3 text-foreground">
              {full_name}
            </h3>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between gap-3 bg-card">
        {image_url ? null : null}
        {biography ? (
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {biography}
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

export default AuthorCard;