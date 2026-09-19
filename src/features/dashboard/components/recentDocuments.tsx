"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Book, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchDocuments } from "../../document/documentHook";

interface RecentDocument {
  id: string;
  title: string;
  author_name?: string | null;
  created_at?: string | null;
}

const RecentDocuments = () => {
  const { data: documents, isLoading } = useFetchDocuments();

  const recent = useMemo(() => {
    if (!documents) return [];
    // Falls back to the order returned by the API if created_at isn't present.
    const sorted = [...(documents as RecentDocument[])].sort(
      (a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      },
    );
    return sorted.slice(0, 5);
  }, [documents]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recently Added</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}

        {!isLoading && recent.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">
            No documents yet.
          </p>
        )}

        {!isLoading &&
          recent.map((doc) => (
            <Link
              key={doc.id}
              href={`/dashboard/documents/${doc.id}`}
              className="group flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition-colors"
            >
              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Book className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">
                  {doc.title}
                </p>
                {doc.author_name && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {doc.author_name}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
      </CardContent>
    </Card>
  );
};

export default RecentDocuments;
