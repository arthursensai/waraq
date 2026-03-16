"use client";

import { useFetchAuthor } from "../authorHook";
import Image from "next/image";
import { Loader } from "@/components/ui/loader";
import UpdateAuthor from "./updateAuthor";
import DeleteAuthor from "./deleteAuthor";
import { AvalaiblityType } from "@/lib/constants/types";

const AuthorPreview = ({ id, type }: { id: string; type: AvalaiblityType }) => {
  const { data: author, isLoading, isError } = useFetchAuthor({ id, type });

  if (isLoading) return <Loader text="Loading Author details" />;
  if (isError) return <div>Error loading author</div>;
  if (!author) return <div>No Avalaile Author </div>;

  return (
    <div className="w-full min-h-svh">
      <div className="w-full flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="w-full sm:w-52 sm:h-52 h-64 border-border bg-card shrink-0">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={author.image_url}
              alt={author.full_name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-1 gap-4 flex-col bg-card rounded-lg p-4">
          <div className="flex gap-4 flex-col">
            <div>
              <h2 className="field-legend text-[14px]">Full Name:</h2>
              <p>{author.full_name}</p>
            </div>
            <div>
              <h2 className="field-legend text-[14px]">Biography:</h2>
              <p>{author.biography}</p>
            </div>
          </div>

          {/* Actions */}
          {type == "private" ? (
            <div className="w-full flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex-1">
                <UpdateAuthor author={author} />
              </div>
              <div className="flex-1">
                <DeleteAuthor author={author} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AuthorPreview;
