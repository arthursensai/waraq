import { useZoomCapability } from "@embedpdf/plugin-zoom/react";
import { useSaveCurrentPage, useScrollToPageOnLoad } from "../readerHooks";
import { DocumentContent } from "@embedpdf/plugin-document-manager/react";
import { FullscreenProvider } from "@embedpdf/plugin-fullscreen/react";
import { Viewport } from "@embedpdf/plugin-viewport/react";
import { Scroller } from "@embedpdf/plugin-scroll/react";
import { RenderLayer } from "@embedpdf/plugin-render/react";

const DocumentViewer = ({
  activeDocumentId,
  initialPage = 1,
  onSavePage,
}: {
  activeDocumentId: string;
  initialPage?: number;
  onSavePage: (page: number) => void;
}) => {
  const { provides: zoom } = useZoomCapability();

  useScrollToPageOnLoad(activeDocumentId, initialPage);

  const currentPage = useSaveCurrentPage({
    documentId: activeDocumentId,
    onSavePage,
  });

  const currentScale = (zoom as any)?.currentZoomLevel ?? 1;
  const renderScale =
    currentScale *
    (typeof window !== "undefined" ? window.devicePixelRatio : 1);

  return (
    <DocumentContent documentId={activeDocumentId}>
      {({ isLoaded, isLoading }) => (
        <>
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              Loading document…
            </div>
          )}
          {isLoaded && (
            <div className="relative h-full w-full">
              <FullscreenProvider>
                <Viewport
                  documentId={activeDocumentId}
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#f1f3f5",
                    overflow: "auto",
                  }}
                >
                  <Scroller
                    documentId={activeDocumentId}
                    renderPage={({ width, height, pageIndex }) => (
                      <div
                        style={{
                          width,
                          height,
                          margin: "0 auto",
                          backgroundColor: "white",
                        }}
                      >
                        <RenderLayer
                          documentId={activeDocumentId}
                          pageIndex={pageIndex}
                          scale={renderScale}
                        />
                      </div>
                    )}
                  />
                </Viewport>
              </FullscreenProvider>
            </div>
          )}
        </>
      )}
    </DocumentContent>
  );
};

export default DocumentViewer;