import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/one-time-password")({
  component() {
    return "Hello /auth/one-time-password!";
  },
});
