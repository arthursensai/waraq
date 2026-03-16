import { AvalaiblityType } from "@/lib/constants/types";
import AuthorPreview from "@/src/features/author/components/authorPreview";

const Page = async ({
  params,
}: {
  params: Promise<{ id: string; type: AvalaiblityType }>;
}) => {
  const { id, type } = await params;

  console.log(id, type)

  return (
    <section className="w-full min-h-svh flex flex-col items-center justify-center">
      <AuthorPreview id={id} type={type} />
    </section>
  );
};

export default Page;
