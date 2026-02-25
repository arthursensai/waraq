"use client";

import PDFSection from "@/components/pdf-section";
import { Suspense, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPdf } from "@/api/pdf";
import { pdfDetails } from "@/types/interfaces";

const Page = ({ params }: { params: Promise<{ pdfFileId: string }> }) => {
  const { pdfFileId } = use(params);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["pdfs"],
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

export default Page;
