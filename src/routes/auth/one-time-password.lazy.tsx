import { createLazyFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useOneTimePassword } from "../../api/auth";

const FormSchema = z.object({
  code: z.string().trim().min(1).max(6),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export const Route = createLazyFileRoute("/auth/one-time-password")({
  component: Component,
});

function Component() {
  // const navigate = useNavigate({ from: "/auth/one-time-password" });
  // useAuth((user) => {
  //   if (!user) return;
  //   navigate({ to: "/dashboard" });
  // });

  const { mutateAsync } = useOneTimePassword();
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
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
        <h3 className="text-center mb-2">Login via OTP</h3>
        <Form.Group className="my-3">
          <Form.Label htmlFor="code">One Time Password</Form.Label>
          <Form.Control
            {...form.register("code", { required: false })}
            name="code"
            type="text"
            placeholder="One Time Password"
          />
          {form.formState.errors.code?.message && (
            <Form.Text>{form.formState.errors.code?.message}</Form.Text>
          )}
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="my-3"
          disabled={form.disabled}
          style={{ width: "100%" }}
        >
          Login
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
