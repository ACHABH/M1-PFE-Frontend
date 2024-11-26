import { createLazyFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  password: z.string().trim().min(1),
  password_confirmation: z.string().trim().min(1),
})

export const Route = createLazyFileRoute("/auth/reset-password")({
  component: Component,
});

function Component() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      password_confirmation: ""
    }
  })
  return "Hello /auth/reset-password!";
}
