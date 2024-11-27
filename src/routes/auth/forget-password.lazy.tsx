import { createLazyFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";

const FormSchema = z.object({
  email: z.string().trim().min(1).email(),
});

export const Route = createLazyFileRoute("/auth/forget-password")({
  component: Component,
});

function Component() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
  form;
  return "Hello /auth/forget-password!";
}
