import {
  createLazyFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "../../api/auth";

export const Route = createLazyFileRoute("/dashboard/teacher")({
  component: Component,
});

function Component() {
  // const navigate = useNavigate();
  // const user = useAuth((user) => {
  //   if (user?.role === "teacher" || import.meta.env.DEV) return;
  //   navigate({ to: "/dashboard" });
  // });

  // (import.meta.env.DEV ? true : user)
  return true  && <Outlet />;
}
