import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { useCreate as useCreateRoom } from "../../api/room";

type Props = {
  onAdd: () => void;
  onCancel: () => void;
};

const FormSchema = z.object({
  rooms: z.string().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default function AddRoom({ onAdd, onCancel }: Props) {
  const { mutateAsync: createRoom } = useCreateRoom();
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rooms: "",
    },
  });

  return (
    <Container
      as="div"
      className="container my-4 component-bg shadow p-3 rounded"
      style={{ width: "500px" }}
    >
      <h3>Add Room</h3>
      <Form
        onSubmit={form.onSubmit(async (data) => {
          await Promise.allSettled(
            data.rooms.split(",").map(async (room) => {
              const parsed = room.trim().toLowerCase();
              await createRoom({ room: parsed });
            })
          );
          onCancel();
        })}
      >
        <Form.Group className="mb-3">
          <Form.Label>Rooms (Comma-separated)</Form.Label>
          <Form.Control
            {...form.register("rooms", { required: true })}
            type="text"
            placeholder="e.g., N101, N102, N103"
          />
        </Form.Group>
        <Container as="div" style={{ display: "flex", gap: 5 }}>
          <Button type="submit" variant="primary">
            Add
          </Button>
          <Button type="reset" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Container>
      </Form>
    </Container>
  );
}
