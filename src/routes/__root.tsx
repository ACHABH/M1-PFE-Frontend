import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useTheme } from "../contexts/theme";
import NavigationMotionLayout from "../layout/navigation-motion";
import NotFound from "../not-found";
import { useAuth } from "../api/auth";
import Loading from "../loading";

function ThemeMode() {
  const { theme, toggleTheme } = useTheme()!;
  return (
    <Nav.Link as="span">
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

  return (
    <>
      <Navbar expand="lg" className="component-bg myBorder-bottom">
        <Container>
          <Navbar.Brand as={Link} to="/">
            PFE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Nav.Link as={Link}>
                    {user.first_name} {user.last_name}
                  </Nav.Link>
                  <Nav.Link as={Link}>Log out</Nav.Link>
                  <ThemeMode />
                </>
              ) : (
                <Stack
                  direction="horizontal"
                  style={{ justifyContent: "space-between" }}
                >
                  <Nav.Link as="span">
                    <Link to="/auth/login" className="btn btn-primary">
                      Login
                    </Link>
                  </Nav.Link>
                  <ThemeMode />
                </Stack>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NavigationMotionLayout>
        <Container
          as="main"
          style={{ width: "100vw", height: "100vh", padding: "0" }}
          fluid
        >
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Container>
      </NavigationMotionLayout>
      <Container
        as="footer"
        style={{
          marginTop: "auto",
          position: "sticky",
          bottom: "0",
          width: "100%",
          borderTop: "2px outset",
        }}
        className="component-bg"
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
