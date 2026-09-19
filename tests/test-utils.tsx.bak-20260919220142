import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";

/**
 * Renders a component wrapped in a fresh QueryClientProvider so that
 * components using TanStack Query hooks (useMutation/useQuery) don't need
 * a real app-wide provider tree in every test.
 *
 * Retries are disabled and errors are silenced so failed mutations in
 * tests resolve immediately instead of retrying/logging noise.
 */
export function renderWithQueryClient(
  ui: ReactElement,
  options?: RenderOptions,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
      options,
    ),
  };
}
