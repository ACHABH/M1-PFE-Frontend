import { createLazyFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../api/auth";

export const Route = createLazyFileRoute("/dashboard/company")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const user = useAuth((user) => {
    if (user?.role === "company") return;
    navigate({ to: "/dashboard" });
  });

  return user && <Outlet />;
}
