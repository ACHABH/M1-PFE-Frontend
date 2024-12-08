import {
  createLazyFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "../api/auth";
import Container from "react-bootstrap/esm/Container";
import SideMenu from "../components/side-menu";
import { useState } from "react";

export const Route = createLazyFileRoute("/dashboard")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const user = useAuth((user) => {
    if (user) return;
    navigate({ to: "/auth/login" });
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleMenu = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  return (
    (import.meta.env.DEV ? true : user) && (
      <Container
        style={{ width: "100vw", minHeight: "100vh", paddingLeft: "0" }}
        fluid
      >
        <div style={{ display: "flex", height: "100vh" }}>
          <div style={{ height: "100vh" }} className="bg-white">
            {isSidebarCollapsed && <SideMenu userRole={user?.role} />}
          </div>
          <div style={{ height: "100vh" }} className="mx-auto content">
            <button
              onClick={() => toggleMenu(setIsSidebarCollapsed)}
              className="collapse-toggle btn btn-primary"
            >
              <i className={` bi ${isSidebarCollapsed ? "bi-x" : "bi-list"}`}></i>
            </button>
            <Outlet />
          </div>
        <style>{`
          @media (max-width: 768px) {
            .content {
              width: 100vw;
            }
            .collapse-toggle {
              display: block;
            }
          }
          @media (min-width: 769px) {
            .collapse-toggle{
              display: none;
            }
            .side-menu-container {
              width: 18vw;
              display: block;
            }
            .content {
              width: 78vw;
            }
          }
        `}</style>
        </div>
      </Container>
    )
  );
}
