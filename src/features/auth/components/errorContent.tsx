const ErrorContent = async ({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) => {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-muted-foreground w-full">
          Code error: {params.error}
        </p>
      ) : (
        <p className="text-muted-foreground w-full">
          An unspecified error occurred.
        </p>
      )}
    </>
  );
};

export default ErrorContent;
