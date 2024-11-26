import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/forget-password")({
  component() {
    return "Hello /auth/forget-password!";
  },
});
