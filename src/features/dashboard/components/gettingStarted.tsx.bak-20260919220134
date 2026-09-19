"use client";

import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFetchDocuments } from "../../document/documentHook";
import { useFetchAllAuthors } from "../../author/authorHook";
import { useFetchNotes } from "../../note/noteHook";

const GettingStarted = () => {
  const { data: documents } = useFetchDocuments();
  const { data: authors } = useFetchAllAuthors();
  const { data: notes } = useFetchNotes();

  const steps = [
    {
      label: "Add your first author",
      href: "/dashboard/authors/new",
      done: (authors?.length ?? 0) > 0,
    },
    {
      label: "Upload your first document",
      href: "/dashboard/documents/new",
      done: (documents?.length ?? 0) > 0,
    },
    {
      label: "Write your first note",
      href: "/dashboard/notes/new",
      done: (notes?.length ?? 0) > 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Waraq</CardTitle>
        <CardDescription>
          Get started by completing these steps.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {steps.map(({ label, href, done }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition-colors"
          >
            {done ? (
              <Check className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span
              className={
                done
                  ? "text-sm line-through text-muted-foreground"
                  : "text-sm font-medium"
              }
            >
              {label}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default GettingStarted;
