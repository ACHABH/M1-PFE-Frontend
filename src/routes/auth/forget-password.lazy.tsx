import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useAuth, useForgetPassword } from "../../api/auth";

const FormSchema = z.object({
  email: z.string().trim().min(1).email(),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export const Route = createLazyFileRoute("/auth/forget-password")({
  component: Component,
});

function Component() {
  const navigate = useNavigate({ from: "/auth/forget-password" });
  useAuth((user) => {
    if (!user) return;
    navigate({ to: "/dashboard" });
  });

  const { mutateAsync } = useForgetPassword();
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form
      onSubmit={form.onSubmit((data) => mutateAsync(data))}
      className="justify-content-center bg-white p-4 shadow mt-5"
      style={{
        width: "30%",
        margin: "auto",
        borderRadius: "20px",
        border: "1.5px solid #ccc",
      }}
    >
      <h4 className="text-center mb-2">Forget Password</h4>
      <p className="text-center mb-4">
        Enter your email to reset your password
      </p>
      <Form.Group className="my-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          {...form.register("email", { required: false })}
          name="email"
          type="email"
          placeholder="One Time Password"
        />
        {form.formState.errors.email?.message && (
          <Form.Text>{form.formState.errors.email?.message}</Form.Text>
        )}
      </Form.Group>
      <Stack direction="horizontal" style={{ justifyContent: "center" }}>
        <Button
          variant="primary"
          type="submit"
          className="my-3"
          disabled={form.disabled}
          style={{ width: "100%" }}
        >
          Confirm
        </Button>
      </Stack>
    </Form>
  );
}
