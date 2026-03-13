import DocumentPreview from "@/src/features/document/components/documentPreview";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <section className="w-full min-h-screen">
      <DocumentPreview id={id} />
    </section>
  );
};

export default Page;
