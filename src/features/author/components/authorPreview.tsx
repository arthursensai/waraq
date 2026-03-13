"use client";

import { use } from "react";
import { useFetchAuthor } from "../authorHook";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import UpdateAuthor from "./updateAuthor";
import DeleteAuthor from "./deleteAuthor";
import { notFound } from "next/navigation";

const AuthorPreview = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: author, isLoading, isError } = useFetchAuthor(id);

  if (isLoading) return <Loader text="Loading Author details" />;
  if (!author) notFound();

  if (isError) return <div>Error loading author</div>;

  return (
    <div className="h-full w-full min-h-screen">
      <div className="w-full flex gap-4">
        <div className="flex w-52 h-52 border-border bg-card">
          <div className="relative flex-1 rounded-lg overflow-hidden">
            <Image
              src={author.image_url}
              alt={author.full_name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-1 gap-4 flex-col bg-card rounded-lg p-4">
          <div className="flex gap-4 flex-col ">
            <div>
              <h2 className="field-legend text-[14px]">Full Name:</h2>
              <p>{author.full_name}</p>
            </div>
            <div>
              <h2 className="field-legend text-[14px]">Biography:</h2>
              <p>{author.biography}</p>
            </div>
          </div>
          <div className="w-full flex gap-4">
            <div className="flex-1">
              <UpdateAuthor author={author} />
            </div>
            <div className="flex-1">
              <DeleteAuthor author={author} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPreview;
