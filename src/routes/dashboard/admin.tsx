import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../api/auth";

export const Route = createFileRoute("/dashboard/admin")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  useAuth((user) => {
    if (user && user.role === "admin") return;
    navigate({ to: "/dashboard/admin" });
  });

  return <Outlet />;
}
