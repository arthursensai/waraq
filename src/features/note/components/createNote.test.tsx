import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQueryClient } from "../../../../tests/test-utils";
import CreateNote from "./createNote";

const mutate = vi.fn();

vi.mock("../../document/documentHook", () => ({
  useFetchDocuments: () => ({ data: [] }),
}));

vi.mock("../noteHook", () => ({
  useCreateNote: () => ({ mutate, isPending: false }),
}));

describe("CreateNote", () => {
  beforeEach(() => {
    mutate.mockClear();
  });

  it("keeps the Save button disabled until the note has at least 3 characters", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CreateNote />);

    const saveButton = screen.getByRole("button", { name: /save note/i });
    expect(saveButton).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText(/capture your thought/i),
      "ab",
    );
    expect(saveButton).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText(/capture your thought/i),
      "c",
    );
    expect(saveButton).toBeEnabled();
  });

  it("submits the note content when saved", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<CreateNote />);

    await user.type(
      screen.getByPlaceholderText(/capture your thought/i),
      "This quote stuck with me.",
    );
    await user.click(screen.getByRole("button", { name: /save note/i }));

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ content: "This quote stuck with me." }),
    );
  });
});
