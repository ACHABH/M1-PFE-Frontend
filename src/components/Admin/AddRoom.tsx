import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";

type Props = {
  onAdd: () => void;
  onCancel: () => void;
};

const FormSchema = z.object({
  rooms: z.string().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default function AddRoom({ onAdd, onCancel }: Props) {}