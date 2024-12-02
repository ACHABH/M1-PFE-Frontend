import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useTheme } from "../contexts/theme";
import NavigationMotionLayout from "../layout/navigation-motion";
import NotFound from "../not-found";
import { useAuth, useLogout } from "../api/auth";

function ThemeMode() {
  const { theme, toggleTheme } = useTheme()!;
  return (
    <Nav.Link>
      <Button
        type="button"
        variant={theme === "light" ? "dark" : "light"}
        onClick={() => {
          toggleTheme();
        }}
      >
        {theme === "light" ? (
          <i className="bi bi-moon-fill"></i>
        ) : (
          <i className="bi bi-sun-fill"></i>
        )}
      </Button>
    </Nav.Link>
  );
}

export const Route = createRootRoute({
  component: Component,
  notFoundComponent: NotFound,
});

function Component() {
  const user = useAuth();
  const { mutateAsync: logout } = useLogout();

  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand as="span">
            <Link to="/">PFE</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as="span">
                <Link to="/">Home</Link>
              </Nav.Link>
              {/* <Nav.Link>
                About
              </Nav.Link> */}
            </Nav>
            <Nav style={{ alignItems: "center" }}>
              {user ? (
                <>
                  <Nav.Link as="span">
                    <Link to="/dashboard">
                      {user.first_name} {user.last_name}
                    </Link>
                  </Nav.Link>
                  <Nav.Link as={Button} onClick={() => logout()}>
                    Log out
                  </Nav.Link>
                  <ThemeMode />
                </>
              ) : (
                <Stack
                  direction="horizontal"
                  style={{ justifyContent: "space-between" }}
                >
                  <Nav.Link as="span">
                    <Link to="/auth/login">Login</Link>
                  </Nav.Link>
                  <ThemeMode />
                </Stack>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NavigationMotionLayout>
        <Outlet />
      </NavigationMotionLayout>
      <Container
        as="footer"
        style={{
          marginTop: "auto",
          position: "fixed",
          bottom: "0",
          width: "100%",
          borderTop: "2px outset",
        }}
        fluid
      >
        <p className="text-center p-2" style={{ margin: "0" }}>
          All rights reserved, Abu berk belkaid &copy;
        </p>
      </Container>
      <TanStackRouterDevtools />
    </>
  );
}
