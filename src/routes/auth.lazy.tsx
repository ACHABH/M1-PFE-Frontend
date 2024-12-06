import {
  createLazyFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "../api/auth";

export const Route = createLazyFileRoute("/auth")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const user = useAuth((user) => {
    if (!user) return;
    navigate({ to: "/dashboard" });
  });
  return (import.meta.env.DEV ? true : !user) && <Outlet />;
}
