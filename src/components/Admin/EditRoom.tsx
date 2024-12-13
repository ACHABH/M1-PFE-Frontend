import { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { Container, Form, Button } from 'react-bootstrap';

const RoomSchema = z.object({
    room: z.string().nonempty("Room name is required"),
});

type ZodFormSchema = z.infer<typeof RoomSchema>;

interface EditRoomProps {
    room: ZodFormSchema;
    onUpdate: (room: ZodFormSchema) => void;
    onCancel: () => void;
}


const EditRoom = ({ room, onUpdate, onCancel }: EditRoomProps) => {
    const [formData, setFormData] = useState(room);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onUpdate(formData);
    };

    const handleCancel = () => {
        onCancel();
    };

    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(RoomSchema),
        defaultValues: {
          room: formData.room,
        },
      });

    return (
        <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "500px" }}>
            <h3>Edit Room</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="room">Room</Form.Label>
                    <Form.Control
                        {...form.register("room", { required: true })}
                        type="text"
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button type="submit" className="me-2" variant="primary">
                    Update
                </Button>
                <Button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                </Button>
            </Form>
        </Container>
    );
};

export default EditRoom;