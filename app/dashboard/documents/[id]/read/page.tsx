"use client";

import { Suspense, use } from "react";
import DocumentReader from "@/src/features/reader/components/documentReader";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <DocumentReader params={params} />
    </Suspense>
  );
};

export default Page;
