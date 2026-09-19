"use client";

import { useMemo } from "react";
import { Book, Users, StickyNote, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchDocuments } from "../../document/documentHook";
import { useFetchAllAuthors } from "../../author/authorHook";
import { useFetchNotes } from "../../note/noteHook";

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ElementType;
}

const StatCardSkeleton = () => (
  <Card>
    <CardContent className="flex items-center gap-4 py-4">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-10" />
      </div>
    </CardContent>
  </Card>
);

const StatsCards = () => {
  const { data: documents, isLoading: documentsLoading } =
    useFetchDocuments();
  const { data: authors, isLoading: authorsLoading } = useFetchAllAuthors();
  const { data: notes, isLoading: notesLoading } = useFetchNotes();

  const isLoading = documentsLoading || authorsLoading || notesLoading;

  const stats: StatItem[] = useMemo(() => {
    const totalDocuments = documents?.length ?? 0;
    const finishedDocuments =
      documents?.filter(
        (doc) => doc.total_pages > 0 && doc.read_page >= doc.total_pages,
      ).length ?? 0;

    return [
      { label: "Documents", value: totalDocuments, icon: Book },
      { label: "Authors", value: authors?.length ?? 0, icon: Users },
      { label: "Notes", value: notes?.length ?? 0, icon: StickyNote },
      {
        label: "Finished",
        value: totalDocuments > 0 ? `${finishedDocuments}/${totalDocuments}` : "0",
        icon: CheckCircle2,
      },
    ];
  }, [documents, authors, notes]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-semibold leading-tight">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
