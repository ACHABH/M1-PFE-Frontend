import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import {
  useGet as useGetRoom,
  useCreate as useCreateRoom,
  useUpdate as useUPdateRoom,
} from "../../api/room";
import AddModal, { type Ref } from "../../layout/add-modal";

type Props = {
  roomId: number;
  onClose: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
const FormSchema = z.object({
  room: z.string().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<Ref, Props>(({ roomId = 0, onClose }, ref) => {
  const { data: room } = useGetRoom(roomId);

  const { mutateAsync: createRoom } = useCreateRoom();
  const { mutateAsync: updateRoom } = useUPdateRoom();

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      room: room?.room ?? "",
    },
    values: {
      room: room?.room ?? "",
    },
  });

  return (
    <AddModal ref={ref} title={room ? "Update Room" : "Add Room"} action={null}>
      <Form
        onSubmit={form.onSubmit(async (data) => {
          if (room) {
            await updateRoom({ id: roomId, body: data });
          } else {
            await Promise.allSettled(
              data.room.split(",").map(async (room) => {
                const parsed = room.trim().toLowerCase();
                await createRoom({ room: parsed });
              })
            );
          }
          onClose();
        })}
      >
        <Form.Group className="mb-3">
          <Form.Label>
            {room ? `Update Room ${room.room}` : "Rooms (Comma-separated)"}
          </Form.Label>
          <Form.Control
            {...form.register("room", { required: true })}
            type="text"
            placeholder="e.g., N101, N102, N103"
          />
        </Form.Group>
        <Container as="div" style={{ display: "flex", gap: 5 }}>
          <Button type="submit" variant="primary">
            {room ? "Update" : "Add"}
          </Button>
          <Button type="reset" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Container>
      </Form>
    </AddModal>
  );
});
