import AuthorPreview from "@/src/features/author/components/authorPreview";
import { Suspense } from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={null}>
      <AuthorPreview params={params} />
    </Suspense>
  );
};

export default Page;
