"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchDocuments } from "../../document/documentHook";

const ContinueReading = () => {
  const { data: documents, isLoading } = useFetchDocuments();

  const current = useMemo(() => {
    const unfinished = (documents ?? []).filter(
      (doc) => doc.total_pages > 0 && doc.read_page < doc.total_pages,
    );

    if (!unfinished.length) return null;

    return unfinished.reduce((best, doc) => {
      const bestRatio = best.read_page / best.total_pages;
      const docRatio = doc.read_page / doc.total_pages;
      return docRatio > bestRatio ? doc : best;
    });
  }, [documents]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>
    );
  }

  if (!current) return null;

  const progress = Math.round((current.read_page / current.total_pages) * 100);

  return (
    <Card>
      <CardContent className="py-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <p className="text-xs font-medium uppercase tracking-wide">
            Continue Reading
          </p>
        </div>

        <h3 className="text-lg font-semibold line-clamp-1">
          {current.title}
        </h3>

        <div className="flex flex-col gap-1.5">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">
            Page {current.read_page} of {current.total_pages} ({progress}%)
          </p>
        </div>

        <Button asChild className="w-fit">
          <Link href={`/dashboard/documents/${current.id}/read`}>
            Resume reading
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContinueReading;
