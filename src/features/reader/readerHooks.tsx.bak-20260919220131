"use client";

import { useDocumentManagerCapability } from "@embedpdf/plugin-document-manager/react";

import { useEffect, useRef, useState } from "react";
import { useCapability } from "@embedpdf/core/react";
import type { ScrollPlugin } from "@embedpdf/plugin-scroll";
import { useQuery } from "@tanstack/react-query";
import { fetchFile } from "./readerApi";

export const useFetchFile = (id: string) => {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: async () => {
      return fetchFile(id);
    },
  });
};

export const DocumentRunTime = ({ url }: { url: string }) => {
  const { provides: docManager } = useDocumentManagerCapability();

  useEffect(() => {
    if (docManager) {
      docManager.openDocumentUrl({ url });
    }
  }, [docManager, url]);

  return null;
};

const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

interface SmartSaverOptions {
  documentId: string;
  onSavePage: (page: number) => void;
}

export const useSaveCurrentPage = ({
  documentId,
  onSavePage,
}: SmartSaverOptions) => {
  const { provides: scroll } = useCapability<ScrollPlugin>("scroll");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debouncedSave = useRef(
    debounce((page: number) => {
      onSavePage(page);
    }, 500),
  ).current;

  useEffect(() => {
    if (!scroll || !documentId) return;

    const unsubscribe = scroll.onPageChange((event) => {
      if (event.documentId === documentId) {
        setCurrentPage(event.pageNumber);
        debouncedSave(event.pageNumber);
      }
    });

    return unsubscribe;
  }, [scroll, documentId, debouncedSave]);

  return currentPage;
};

export const useScrollToPageOnLoad = (
  documentId: string,
  initialPage: number,
) => {
  const { provides: scrollCapability } = useCapability<ScrollPlugin>("scroll");

  useEffect(() => {
    if (!scrollCapability || !documentId) return;

    const unsubscribe = scrollCapability.onLayoutReady((event) => {
      if (event.documentId === documentId && event.isInitial) {
        scrollCapability.forDocument(documentId).scrollToPage({
          pageNumber: initialPage,
          behavior: "instant",
        });
      }
    });

    return unsubscribe;
  }, [scrollCapability, documentId, initialPage]);
};
