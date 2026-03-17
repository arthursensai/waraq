import AuthorsPreview from "@/src/features/author/components/authorsPreview";

const Page = async () => {
  return (
    <section className="w-full h-full flex flex-col gap-4">
      <div className="w-full bg-card h-fit p-4 rounded-md">
        <AuthorsPreview type="private" />
      </div>
      <div className="w-full bg-card h-fit p-4 rounded-md">
        <AuthorsPreview type="public" />
      </div>
    </section>
  );
};

export default Page;
