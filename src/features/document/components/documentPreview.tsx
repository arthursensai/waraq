"use client";

import { use } from "react";
import { Loader } from "@/components/ui/loader";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useFetchDocument } from "../documentHook";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  ContentLanguage,
  contentLanguagesDict,
  ContentType,
  contentTypesDict,
} from "../constants";

const DocumentPreview = ({ id }: { id: string }) => {
  const { data: document, isLoading, isError } = useFetchDocument(id);

  if (isLoading) return <Loader text="Loading Document details" />;
  if (!document) notFound();
  if (isError) return <div>Error loading document</div>;

  const progressPercent =
    document.total_pages > 0
      ? Math.round((document.read_page / document.total_pages) * 100)
      : 0;

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-wrap gap-4 items-start">
        {/* Sidebar */}
        <div className="w-full sm:w-[200px] flex flex-col gap-3 shrink-0">
          <Button className="w-full flex items-center justify-between" asChild>
            <Link href={`/dashboard/documents/${id}/read`}>
              Read now
              <ArrowRight size={14} />
            </Link>
          </Button>

          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
            {/* Progress */}
            <div className="flex flex-col gap-1">
              <p className="field-legend text-[11px]">Progress</p>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-medium">
                  {document.read_page}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {document.total_pages} pages
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground">
                {progressPercent}% complete
              </span>
            </div>

            <div className="border-t border-border pt-3 flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <p className="field-legend text-[11px]">Content type</p>
                <span className="text-sm">
                  {contentTypesDict[document.content_type as ContentType] ??
                    document.type}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="field-legend text-[11px]">Language</p>
                <span className="text-sm">
                  {contentLanguagesDict[
                    document.content_language as ContentLanguage
                  ] ?? document.language}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="flex flex-1 min-w-[240px] flex-col gap-5 rounded-lg border border-border bg-card p-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>{document.author_name}</span>
            </div>
            <h1 className="text-2xl font-medium leading-tight mb-3">
              {document.title}
            </h1>
            {document.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-border pt-4">
            <p className="field-legend text-[11px] mb-2">Description</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {document.description}
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-4 flex gap-3 mt-auto">
            <Button className="flex-1" variant="outline">
              Edit
            </Button>
            <Button className="flex-1" variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
