import { useDocumentManagerCapability } from "@embedpdf/plugin-document-manager/react";
import { useEffect } from "react";

export const PdfRuntime = ({ url }: { url: string }) => {
  const { provides: docManager } = useDocumentManagerCapability();

  useEffect(() => {
    if (docManager) {
      docManager.openDocumentUrl({ url });
    }
  }, [docManager, url]);

  return null;
};
