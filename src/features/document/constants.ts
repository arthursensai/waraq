export type ContentLanguage = "ar" | "en" | "de";
export type ContentType =
  | "document"
  | "book"
  | "novel"
  | "essay"
  | "research"
  | "article"
  | "other";

export const contentLanguagesDict: Record<ContentLanguage, string> = {
  en: "English",
  ar: "Arabic",
  de: "German",
};

export const contentTypesDict: Record<ContentType, string> = {
  document: "Document",
  book: "Book",
  novel: "Novel",
  essay: "Essay",
  research: "Research",
  article: "Article",
  other: "Other",
};
