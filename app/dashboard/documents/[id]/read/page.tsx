"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const DocumentReader = dynamic(
  () => import("@/src/features/reader/components/documentReader"),
  { ssr: false, loading: () => <span>Loading reader…</span> },
);

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <DocumentReader params={params} />
    </Suspense>
  );
};

export default Page;
