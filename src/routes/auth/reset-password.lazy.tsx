import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/reset-password")({
  component() {
    return "Hello /auth/reset-password!";
  },
});
