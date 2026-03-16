"use client";

import { useFetchAuthors } from "../authorHook";
import AuthorCard from "./authorCard";
import { Users } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AvalaiblityType } from "@/lib/constants/types";

const AuthorsPreview = ({ type }: { type: AvalaiblityType }) => {
  const { data: authors, isLoading, isError } = useFetchAuthors(type);

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
    <section className="w-full h-full flex gap-4 flex-col">
      <h3 className="field-legend">
        {type == "private" ? "Your authors" : "Public authors"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
        {authors.map((author) => (
          <AuthorCard key={author.id} author={author} type={type} />
        ))}
      </div>
    </section>
  );
};

export default AuthorsPreview;
