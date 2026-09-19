import AuthorPreview from "@/src/features/author/components/authorPreview";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <section className="w-full min-h-svh flex flex-col items-center justify-center">
      <AuthorPreview id={id} />
    </section>
  );
};

export default Page;
