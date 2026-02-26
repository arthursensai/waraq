import { useEffect } from 'react';
import { useCapability } from '@embedpdf/core/react';
import type { ScrollPlugin } from '@embedpdf/plugin-scroll';

export const useScrollToPageOnLoad = (documentId: string, initialPage: number) => {
  const { provides: scrollCapability } = useCapability<ScrollPlugin>('scroll');

  useEffect(() => {
    if (!scrollCapability || !documentId) return;

    const unsubscribe = scrollCapability.onLayoutReady((event) => {
      if (event.documentId === documentId && event.isInitial) {
        scrollCapability.forDocument(documentId).scrollToPage({
          pageNumber: initialPage,
          behavior: 'instant',
        });
      }
    });

    return unsubscribe;
  }, [scrollCapability, documentId, initialPage]);
};