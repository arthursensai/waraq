"use client";

import { useEffect, useRef, useState } from "react";
import { useCapability } from "@embedpdf/core/react";
import type { ScrollPlugin } from "@embedpdf/plugin-scroll";

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
    }, 500)
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