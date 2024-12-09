import {
  createLazyFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "../../api/auth";

export const Route = createLazyFileRoute("/dashboard/student")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const user = useAuth((user) => {
    if (user?.role === "student" || import.meta.env.DEV) return;
    navigate({ to: "/dashboard" });
  });

  return (import.meta.env.DEV ? true : user) && <Outlet />;
}
