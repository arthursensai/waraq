import BookUploadForm from "@/components/book-upload-form";

const Page = async () => {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <BookUploadForm />
    </div>
  )
};

export default Page;