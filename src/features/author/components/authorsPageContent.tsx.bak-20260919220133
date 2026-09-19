"use client";

import { useState } from "react";
import SearchBar from "@/components/sections/searchBar";
import AuthorsPreview from "./authorsPreview";
import { useFetchAllAuthors } from "../authorHook";

const AuthorsPageContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allAuthors } = useFetchAllAuthors();

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const resultsCount = (allAuthors ?? []).filter((author) =>
    author.full_name.toLowerCase().includes(normalizedQuery),
  ).length;

  return (
    <section className="w-full h-full flex flex-col gap-4">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        resultsCount={resultsCount}
      />
      <div className="w-full bg-card h-fit p-4 rounded-md">
        <AuthorsPreview type="private" searchQuery={searchQuery} />
      </div>
      <div className="w-full bg-card h-fit p-4 rounded-md">
        <AuthorsPreview type="public" searchQuery={searchQuery} />
      </div>
    </section>
  );
};

export default AuthorsPageContent;
