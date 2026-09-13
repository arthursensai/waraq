const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      Note {id} — coming soon
    </div>
  );
};

export default Page;