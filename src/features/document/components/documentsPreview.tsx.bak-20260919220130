"use client";

import { Book, Users } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFetchDocuments } from "../documentHook";
import DocumentCard from "./documentCard";

const DocumentsPreview = () => {
  const { data: documents, isLoading, isError } = useFetchDocuments();

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader text="Loading Documents" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <p className="text-destructive text-sm font-medium">
          Failed to load documents
        </p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Book className="size-10 opacity-40" />
        <p className="field-legend">No documents yet</p>
        <Button asChild variant="link">
          <Link href="/dashboard/documents/new">Create a new document</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full h-full content-start">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
};

export default DocumentsPreview;
