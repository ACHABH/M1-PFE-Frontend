import { createLazyFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../api/auth";
import Container from "react-bootstrap/esm/Container";
import SideMenu from "../components/side-menu";

export const Route = createLazyFileRoute("/dashboard")({
  component: Component,
});

function Component() {
  // const navigate = useNavigate();
  // const user = useAuth((user) => {
  //   if (user) return;
  // navigate({ to: "/auth/login" });
  // });

  return (
    true && (
      <Container as="main" style={{ width: "100vw", minHeight: "100vh", paddingLeft:"0"}} fluid>
          <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '18vw', height:'100vh'}} className="bg-white">
              <SideMenu userRole="teacher" />
            </div>
            <div style={{ width: '78vw', height: '100vh'}} className="mx-auto">
              <Outlet />
            </div>
          </div>
      </Container>
    )
  );
}
