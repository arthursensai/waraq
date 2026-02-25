"use client";

import { pdfDetails } from "@/types/interfaces";

import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { DocumentContent, DocumentManagerPluginPackage } from "@embedpdf/plugin-document-manager/react";
import { Viewport, ViewportPluginPackage } from "@embedpdf/plugin-viewport/react";
import { Scroller, ScrollPluginPackage, ScrollStrategy } from "@embedpdf/plugin-scroll/react";
import { RenderLayer, RenderPluginPackage } from "@embedpdf/plugin-render/react";
import { ZoomPluginPackage, ZoomMode, useZoomCapability } from "@embedpdf/plugin-zoom/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import { PdfRuntime } from "./pdf-run-time";

const plugins = [
  createPluginRegistration(DocumentManagerPluginPackage, { maxDocuments: 1 }),
  createPluginRegistration(ViewportPluginPackage),
  createPluginRegistration(ScrollPluginPackage, { defaultStrategy: ScrollStrategy.Vertical }),
  createPluginRegistration(RenderPluginPackage),
  createPluginRegistration(ZoomPluginPackage, {
    defaultZoomLevel: ZoomMode.FitWidth,
  }),
];

interface PDFSectionProps {
  pdfData: pdfDetails;
}

const PDFViewer = ({ activeDocumentId }: { activeDocumentId: string }) => {
  const { provides: zoom } = useZoomCapability();
  
  const currentScale = (zoom as any)?.currentZoomLevel ?? 1;
  const renderScale = currentScale * (typeof window !== "undefined" ? window.devicePixelRatio : 1);

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
          )}
        </>
      )}
    </DocumentContent>
  );
};

const PDFSection = ({ pdfData }: PDFSectionProps) => {
  const { url, title } = pdfData;
  const { engine, isLoading: engineLoading } = usePdfiumEngine();

  if (engineLoading || !engine) {
    return <div className="p-4">Loading PDF engine…</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <h1 className="p-4 text-lg font-semibold">{title}</h1>

      <div className="flex-1 min-w-0 overflow-hidden">
        <EmbedPDF engine={engine} plugins={plugins}>
          {({ activeDocumentId }) => (
            <>
              <PdfRuntime url={url} />
              {activeDocumentId && (
                <PDFViewer activeDocumentId={activeDocumentId} />
              )}
            </>
          )}
        </EmbedPDF>
      </div>
    </div>
  );
};

export default PDFSection;