import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQueryClient } from "../../../../tests/test-utils";
import LoginForm from "./loginForm";

const mutate = vi.fn();

vi.mock("../authHook", () => ({
  useLogin: () => ({ mutate, isPending: false, error: null }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mutate.mockClear();
  });

  it("renders the email and password fields with a submit button", () => {
    renderWithQueryClient(<LoginForm />);

    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows a validation error and does not submit when the password is too short", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<LoginForm />);

    await user.type(screen.getByPlaceholderText("m@example.com"), "reader@waraq.app");
    // "password" is too short to pass the 8-character minimum.
    const passwordInput = screen.getByText("Password:").parentElement!
      .querySelector("input") as HTMLInputElement;
    await user.type(passwordInput, "short");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/at least 8 characters/i),
      ).toBeInTheDocument();
    });
    expect(mutate).not.toHaveBeenCalled();
  });

  it("submits the entered credentials when the form is valid", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<LoginForm />);

    await user.type(screen.getByPlaceholderText("m@example.com"), "reader@waraq.app");
    const passwordInput = screen.getByText("Password:").parentElement!
      .querySelector("input") as HTMLInputElement;
    await user.type(passwordInput, "verysecure123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        email: "reader@waraq.app",
        password: "verysecure123",
      });
    });
  });
});
