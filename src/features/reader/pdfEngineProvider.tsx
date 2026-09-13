"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { usePdfiumEngine } from "@embedpdf/engines/react";

type PdfiumEngine = ReturnType<typeof usePdfiumEngine>["engine"];

interface PdfEngineContextValue {
  engine: PdfiumEngine | null;
  isLoading: boolean;
  requestEngine: () => void;
}

const PdfEngineContext = createContext<PdfEngineContextValue>({
  engine: null,
  isLoading: false,
  requestEngine: () => {},
});

export const usePdfEngine = () => useContext(PdfEngineContext);

const EngineHost = ({
  children,
}: {
  children: (engine: PdfiumEngine | null, isLoading: boolean) => ReactNode;
}) => {
  const { engine, isLoading } = usePdfiumEngine();
  return <>{children(engine, isLoading)}</>;
};

export const PdfEngineProvider = ({ children }: { children: ReactNode }) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  const requestEngine = useCallback(() => setShouldLoad(true), []);

  if (!shouldLoad) {
    return (
      <PdfEngineContext.Provider
        value={{ engine: null, isLoading: false, requestEngine }}
      >
        {children}
      </PdfEngineContext.Provider>
    );
  }

  return (
    <EngineHost>
      {(engine, isLoading) => (
        <PdfEngineContext.Provider
          value={{ engine, isLoading, requestEngine }}
        >
          {children}
        </PdfEngineContext.Provider>
      )}
    </EngineHost>
  );
};
