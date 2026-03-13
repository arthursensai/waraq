"use client";

import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { DocumentManagerPluginPackage } from "@embedpdf/plugin-document-manager/react";
import {
  Viewport,
  ViewportPluginPackage,
} from "@embedpdf/plugin-viewport/react";
import {
  ScrollPluginPackage,
  ScrollStrategy,
} from "@embedpdf/plugin-scroll/react";
import { RenderPluginPackage } from "@embedpdf/plugin-render/react";
import { ZoomPluginPackage, ZoomMode } from "@embedpdf/plugin-zoom/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import { FullscreenPluginPackage } from "@embedpdf/plugin-fullscreen/react";
import DocumentViewer from "./documentViewer";
import { DocumentRunTime, useFetchFile } from "../readerHooks";
import { use } from "react";
import { Loader } from "@/components/ui/loader";
import { notFound } from "next/navigation";
import { updateCurrentPage } from "../readerApi";

const plugins = [
  createPluginRegistration(DocumentManagerPluginPackage, { maxDocuments: 1 }),
  createPluginRegistration(ViewportPluginPackage),
  createPluginRegistration(ScrollPluginPackage, {
    defaultStrategy: ScrollStrategy.Vertical,
  }),
  createPluginRegistration(RenderPluginPackage),
  createPluginRegistration(ZoomPluginPackage, {
    defaultZoomLevel: ZoomMode.FitWidth,
  }),
  createPluginRegistration(FullscreenPluginPackage),
];

const DocumentReader = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: document, isLoading, isError } = useFetchFile(id);

  const { engine, isLoading: engineLoading } = usePdfiumEngine();

  if (engineLoading || !engine) {
    return <Loader text="loading engine" size="lg" />;
  }
  if (isLoading) {
    return <Loader text="loading document" size="lg" />;
  }
  if (isError) notFound();

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 min-w-0 overflow-hidden">
        <EmbedPDF engine={engine} plugins={plugins}>
          {({ activeDocumentId }) => (
            <>
              <DocumentRunTime url={document?.file_url} />
              {activeDocumentId && (
                <DocumentViewer
                  activeDocumentId={activeDocumentId}
                  initialPage={document?.read_page}
                  onSavePage={async (page) => {
                    await updateCurrentPage({
                      id: document?.file_url,
                      newPage: page,
                    });
                  }}
                />
              )}
            </>
          )}
        </EmbedPDF>
      </div>
    </div>
  );
};

export default DocumentReader;
