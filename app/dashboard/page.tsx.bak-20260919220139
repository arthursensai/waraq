"use client";

import { useFetchDocuments } from "@/src/features/document/documentHook";
import { useFetchAllAuthors } from "@/src/features/author/authorHook";
import { useFetchNotes } from "@/src/features/note/noteHook";
import StatsCards from "@/src/features/dashboard/components/statsCards";
import ContinueReading from "@/src/features/dashboard/components/continueReading";
import RecentDocuments from "@/src/features/dashboard/components/recentDocuments";
import ContentBreakdown from "@/src/features/dashboard/components/contentBreakdown";
import RecentNotes from "@/src/features/dashboard/components/recentNotes";
import GettingStarted from "@/src/features/dashboard/components/gettingStarted";

const Page = () => {
  const { data: documents, isLoading: documentsLoading } =
    useFetchDocuments();
  const { data: authors, isLoading: authorsLoading } = useFetchAllAuthors();
  const { data: notes, isLoading: notesLoading } = useFetchNotes();

  const isLoading = documentsLoading || authorsLoading || notesLoading;

  const isEmpty =
    !isLoading &&
    (documents?.length ?? 0) === 0 &&
    (authors?.length ?? 0) === 0 &&
    (notes?.length ?? 0) === 0;

  if (isEmpty) {
    return (
      <section className="w-full max-w-md mx-auto py-8">
        <GettingStarted />
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening in your library.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <ContinueReading />
          <RecentDocuments />
        </div>

        <div className="flex flex-col gap-4">
          <ContentBreakdown />
          <RecentNotes />
        </div>
      </div>
    </section>
  );
};

export default Page;
