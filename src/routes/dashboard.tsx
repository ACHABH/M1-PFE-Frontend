import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../api/auth";

export const Route = createFileRoute("/dashboard")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const user = useAuth((user) => {
    if (user) return;
    navigate({ to: "/auth/login" });
  });

  return (
    <div>
      'Hello /_dashboard!'
      {user?.role === "student" && <h1>student</h1>}
      {user?.role === "teacher" && <h1>teacher</h1>}
      {user?.role === "company" && <h1>company</h1>}
      {user?.role === "admin" && <h1>admin</h1>}
      <Outlet />
    </div>
  );
}
