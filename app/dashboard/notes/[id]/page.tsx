import NotePreview from "@/src/features/note/components/notePreview";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <section className="w-full h-full flex items-center justify-center">
      <NotePreview id={id} />
    </section>
  );
};

export default Page;
