import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

const renderAt = (route) =>
  render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>
  );

test("redirects the root page to login when signed out", async () => {
  renderAt("/");

  expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
});

test("protects the dashboard when signed out", async () => {
  renderAt("/dashboard");

  expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
  expect(screen.queryByText("Recent transactions")).not.toBeInTheDocument();
});

test("renders login without the dashboard shell", () => {
  renderAt("/login");

  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.queryByText("Menu")).not.toBeInTheDocument();
});

test("renders register without the dashboard shell", () => {
  renderAt("/register");

  expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  expect(screen.queryByText("Menu")).not.toBeInTheDocument();
});
