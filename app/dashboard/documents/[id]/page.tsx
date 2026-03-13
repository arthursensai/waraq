import DocumentPreview from "@/src/features/document/components/documentPreview";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <section className="w-full min-h-screen">
        <DocumentPreview params={params} />
    </section>
  );
};

export default Page;
