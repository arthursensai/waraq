import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQueryClient } from "../../../../tests/test-utils";
import DeleteAuthor from "./deleteAuthor";

const mutate = vi.fn();

vi.mock("../authorHook", () => ({
  useDeleteAuthor: () => ({ mutate }),
}));

const author = { id: "author-1", full_name: "Jane Austen" };

describe("DeleteAuthor", () => {
  beforeEach(() => {
    mutate.mockClear();
  });

  it("does not delete immediately - it opens a confirmation dialog first", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DeleteAuthor author={author} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(
      screen.getByText(/are you absolutely sure/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Jane Austen/)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("only calls the delete mutation after the user confirms", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DeleteAuthor author={author} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it("does not call the mutation if the user cancels", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DeleteAuthor author={author} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mutate).not.toHaveBeenCalled();
  });
});
