"use client";

import { fetchPdfs } from "@/src/api/pdf";
import LibraryToolbar from "@/components/library-toolbar";
import PdfsSection from "@/components/pdfs-section";
import { Skeleton } from "@/components/ui/skeleton";
import { pdfDocumentSchema } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LibraryFilters } from "@/types/interfaces";

const Page = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["pdfs"],
    queryFn: fetchPdfs,
  });

  const [filters, setFilters] = useState<LibraryFilters>({});

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] w-full flex flex-col border-accent border-2 rounded-lg transition-all overflow-hidden cursor-wait"
          >
            <div className="flex-1 relative bg-muted/20">
              <Skeleton className="h-full w-full rounded-none" />
            </div>

            <div className="p-3 bg-background border-t border-accent">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const pdfs = data as pdfDocumentSchema[];

  const applyFilters = () => {
    if (!filters.language) {
      return pdfs;
    }
    return pdfs.map((pdf, i) =>
      pdf.language == filters.language ? pdf : null,
    );
  };

  return (
    <section className="flex-1 w-full p-4 flex flex-col gap-4">
      {/* under developement */}
      {/* <LibraryToolbar filters={filters} setFilters={setFilters} /> */}
      <PdfsSection pdfs={pdfs} refetch={refetch} />
    </section>
  );
};

export default Page;
