import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  UserRound,
  FileText,
  Sparkles,
  Cookie,
  Trash2,
  Lock,
  Mail,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Data Safety | Waraq",
  description:
    "What data Waraq collects, how it is stored and processed, and what control you have over it.",
};

type DataRow = {
  label: string;
  detail: string;
};

type Section = {
  id: string;
  icon: React.ElementType;
  title: string;
  intro?: string;
  rows?: DataRow[];
  bullets?: string[];
};

const LAST_UPDATED = new Date().toLocaleDateString("en-GB", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const sections: Section[] = [
  {
    id: "account",
    icon: UserRound,
    title: "Account & profile data",
    intro:
      "Created when you sign up and complete onboarding. Authentication is handled by Supabase Auth.",
    rows: [
      { label: "Email address", detail: "Used for sign-in, email verification and password resets." },
      { label: "Password", detail: "Stored hashed by Supabase Auth — Waraq never sees or stores it in plain text." },
      { label: "Username", detail: "Public display name shown across the app." },
      { label: "Profile picture", detail: "Uploaded via UploadThing and linked to your profile." },
    ],
  },
  {
    id: "documents",
    icon: FileText,
    title: "Documents & files you upload",
    intro:
      "Your library is the core of Waraq, so we store exactly what you upload — nothing more.",
    rows: [
      { label: "PDF documents", detail: "Stored as files via UploadThing; metadata (title, page count, owner) kept in our database." },
      { label: "Notes", detail: "Any notes you write against a document are saved to your account and are private to you." },
      { label: "Reading progress", detail: "Current page / position, so you can pick up where you left off." },
    ],
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "AI features (chat & search)",
    intro:
      "To let you ask questions about your own documents, Waraq processes their content with Google's Gemini API.",
    rows: [
      { label: "Document text chunks & embeddings", detail: "Extracted from your PDFs and sent to Google Gemini to generate embeddings used for search and Q&A. Chunks are stored so they don't need to be regenerated." },
      { label: "AI chat messages", detail: "Your questions and the AI's answers about a document are saved to your account so you can revisit a conversation." },
    ],
    bullets: [
      "Only the documents you choose to upload are processed — nothing is sent to the AI without you adding it to your library.",
      "AI processing is governed additionally by Google's own API data-use terms.",
    ],
  },
  {
    id: "technical",
    icon: Cookie,
    title: "Technical & analytics data",
    rows: [
      { label: "Usage analytics", detail: "Vercel Analytics collects anonymized page-view and interaction data to help us understand feature usage." },
      { label: "Performance data", detail: "Vercel Speed Insights measures load times and performance — no personal content is included." },
      { label: "Session cookies", detail: "Supabase sets essential cookies to keep you signed in. We don't use third-party advertising cookies or trackers." },
    ],
  },
  {
    id: "storage",
    icon: Lock,
    title: "Where data is stored & how it's protected",
    bullets: [
      "Database and authentication: Supabase (PostgreSQL, with row-level security so your data is only ever accessible to your account).",
      "File storage: UploadThing, for uploaded PDFs and images.",
      "Hosting: Vercel.",
      "All traffic is encrypted in transit (HTTPS/TLS). We do not sell or rent your personal data to third parties, and we don't use it for advertising.",
    ],
  },
  {
    id: "retention",
    icon: Trash2,
    title: "Retention & deletion",
    bullets: [
      "Your data is kept for as long as your account is active.",
      "Deleting a document removes its file, extracted chunks, embeddings and related AI chat history.",
      "Deleting your account removes your profile, documents, notes and chat history within a reasonable timeframe, except where we must retain something for legal or security reasons.",
      "An automated internal job periodically clears storage files that are no longer linked to any account (e.g. an interrupted upload) — this doesn't affect data attached to your account.",
    ],
  },
  {
    id: "rights",
    icon: ShieldCheck,
    title: "Your rights & choices",
    bullets: [
      "View and update your profile information at any time from your account settings.",
      "Delete individual documents, notes, or AI chat threads whenever you want.",
      "Request an export of your data or full account deletion by contacting us below.",
      "Waraq is not directed at children under 13, and we don't knowingly collect data from them.",
    ],
  },
];

const DataSafetyPage = () => {
  return (
    <main className="w-full">
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-8">
        <p className="font-serif italic text-primary text-sm mb-2">Waraq</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Data Safety
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          This page explains, in plain language, what data Waraq collects,
          why we collect it, where it lives, and how you stay in control of
          it.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 space-y-6">
        {sections.map(({ id, icon: Icon, title, intro, rows, bullets }) => (
          <Card key={id} id={id} className="scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {intro && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {intro}
                </p>
              )}

              {rows && (
                <div className="space-y-3">
                  {rows.map((row) => (
                    <div key={row.label} className="text-sm">
                      <p className="font-medium text-foreground">
                        {row.label}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {row.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {bullets && (
                <ul className="space-y-2">
                  {bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}

        <Separator />

        <Card id="contact">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Mail className="h-4 w-4" />
              </span>
              Questions about your data?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Contact us at{" "}
              <Link
                href="mailto:privacy@waraq.tech"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                privacy@waraq.tech
              </Link>{" "}
              for access, export, or deletion requests, or anything else
              about how your data is handled.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default DataSafetyPage;
