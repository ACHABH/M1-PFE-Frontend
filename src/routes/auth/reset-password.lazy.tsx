import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { useResetPassword } from "../../api/auth";

const FormSchema = z.object({
  code: z.string().trim().min(1),
  password: z.string().trim().min(1),
  password_confirmation: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export const Route = createLazyFileRoute("/auth/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  // const navigate = useNavigate({ from: "/auth/reset-password" });
  // useAuth((user) => {
  //   if (!user) return;
  //   navigate({ to: "/dashboard" });
  // });

  const { mutateAsync } = useResetPassword();
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
      password: "",
      password_confirmation: "",
    },
  });

  return (
    
    <>
    <Form
      onSubmit={form.onSubmit((data) => mutateAsync(data))}
      className="justify-content-center p-4 shadow mt-5 login-form component-bg"
      style={{
        margin: "auto",
        borderRadius: "20px",
        border: "1.5px solid #ccc",
      }}
    >
      <h3 className="text-center mb-2">Reset Password</h3>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="code">Code</Form.Label>
        <Form.Control
          {...form.register("code", { required: false })}
          name="code"
          type="code"
          placeholder="code"
        />
        {form.formState.errors.password?.message && (
          <Form.Text>{form.formState.errors.password?.message}</Form.Text>
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
        <Form.Label htmlFor="password-confirmation">
          Confirm Password
        </Form.Label>
        <Form.Control
          {...form.register("password_confirmation", { required: true })}
          type="password"
          placeholder="Confirm password"
          required
        />
        {form.formState.errors.password_confirmation?.message && (
          <Form.Text>
            {form.formState.errors.password_confirmation?.message}
          </Form.Text>
        )}
      </Form.Group>
      <Button variant="primary" type="submit" disabled={form.disabled}>
        Reset Password
      </Button>
    </Form>
    <style>{`
        @media (min-width: 769px) {
          .login-form{
            width: 30vw;
          }
        }
        @media (min-width:478px) and (max-width: 768px) {
          .login-form{
            width: 70vw;
          }
        }
        @media (max-width:477px){
          .login-form{
            width: 95vw;
          }
        }
      `}
      </style>
    </>
  );
}
