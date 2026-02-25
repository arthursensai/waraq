"use client";

import PDFSection from "@/components/pdf-section";
import { Suspense, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPdf } from "@/src/api/pdf";
import { pdfDetails } from "@/types/interfaces";

const PageContent = ({ params }: { params: Promise<{ pdfFileId: string }> }) => {
  const { pdfFileId } = use(params);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["pdfs", pdfFileId],
    queryFn: () => fetchPdf(pdfFileId),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const pdfData = data as pdfDetails;

  return (
    <section className="w-full h-screen">
      <PDFSection pdfData={pdfData} />
    </section>
  );
};

const Page = ({ params }: { params: Promise<{ pdfFileId: string }> }) => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <PageContent params={params} />
    </Suspense>
  );
};

export default Page;