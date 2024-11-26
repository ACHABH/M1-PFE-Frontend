import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useTheme } from "../contexts/theme";
import NavigationMotionLayout from "../layout/navigation-motion";

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

const user = {
  first_name: "test",
  last_name: "test",
};

export const Route = createRootRoute({
  component: Component,
});

function Component() {
  return (
    <>
      <Navbar expand="lg">
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
                  <Nav.Link as={Link} to="/login">
                    <Button type="button">Login</Button>
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
      <Container as="footer">
        <p className="text-center">
          All rights reserved, Abu berk belkaid &copy;
        </p>
      </Container>
      <TanStackRouterDevtools />
    </>
  );
}
