import { createLazyFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  code: z.string().trim().min(1),
});

export const Route = createLazyFileRoute("/auth/one-time-password")({
  component: Component,
});

function Component() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });
  form;
  return "Hello /auth/one-time-password!";
}
