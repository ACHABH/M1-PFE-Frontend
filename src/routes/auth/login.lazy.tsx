import { createLazyFileRoute, Link } from "@tanstack/react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";

const FormSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(0),
  remember: z.coerce.boolean(),
});

export const Route = createLazyFileRoute("/auth/login")({
  component: Component,
});

function Component() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  return (
    <Form
      onSubmit={form.onSubmit(async (data) => {
        console.log(data);
      })}
      className="justify-content-center bg-white p-4 shadow mt-5"
      style={{
        width: "30%",
        margin: "auto",
        borderRadius: "20px",
        border: "1.5px solid #ccc",
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email address</Form.Label>
        <Form.Control
          {...form.register("email", { required: true })}
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        {form.formState.errors.email?.message && (
          <Form.Text>{form.formState.errors.email?.message}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          {...form.register("password", { required: false })}
          name="password"
          type="password"
          placeholder="Password"
        />
        {form.formState.errors.password?.message && (
          <Form.Text>{form.formState.errors.password?.message}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Check
          {...form.register("remember", { required: true })}
          name="remember"
          type="checkbox"
          label="Check me out"
          checked
        />
        {form.formState.errors.remember?.message && (
          <Form.Text>{form.formState.errors.remember.message}</Form.Text>
        )}
      </Form.Group>
      <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
        <Button variant="primary" type="submit" disabled={form.disabled}>
          Sign in
        </Button>
        <Link to="/auth/forget-password">Forgot your password?</Link>
      </Stack>
    </Form>
  );
}
