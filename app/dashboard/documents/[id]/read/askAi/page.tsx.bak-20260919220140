import AiChat from "@/src/features/ai/components/aiChat";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <section className="h-full w-full">
      <AiChat documentId={id} />
    </section>
  );
};

export default Page;
