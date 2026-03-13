const Page = ({ params }: { params: { id: Promise<string> } }) => {
  const { id } = params;

  return (
    <div>
        {id}
    </div>
  )
};

export default Page;