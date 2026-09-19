"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchDocuments } from "../../document/documentHook";
import { contentTypesDict, ContentType } from "../../document/constants";

const ContentBreakdown = () => {
  const { data: documents, isLoading } = useFetchDocuments();

  const breakdown = useMemo(() => {
    if (!documents?.length) return [];

    const counts = documents.reduce<Record<string, number>>((acc, doc) => {
      const key = doc.content_type as ContentType;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const total = documents.length;

    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        label: contentTypesDict[type as ContentType] ?? type,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [documents]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Content Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}

        {!isLoading && breakdown.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">
            No documents yet.
          </p>
        )}

        {!isLoading &&
          breakdown.map(({ type, label, count, percentage }) => (
            <div key={type} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default ContentBreakdown;
