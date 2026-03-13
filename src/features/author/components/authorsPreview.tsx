"use client";

import { Spinner } from "@/components/ui/spinner";
import { useFetchAuthors } from "../authorHook";
import AuthorCard from "./authorCard";
import { Users } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AuthorsPreview = () => {
  const { data: authors, isLoading, isError } = useFetchAuthors();

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader text="Loading authors" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <p className="text-destructive text-sm font-medium">
          Failed to load authors
        </p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (!authors?.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Users className="size-10 opacity-40" />
        <p className="field-legend">No authors yet</p>
        <Button asChild variant="link">
          <Link href="/dashboard/authors/new">Add an author</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full h-full content-start">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
};

export default AuthorsPreview;
