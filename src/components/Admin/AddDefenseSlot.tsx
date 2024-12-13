import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { Container, Form, Button } from "react-bootstrap";

type Props = {
  onAdd: () => void;
  onCancel: () => void;
};

const FormSchema = z.object({
  startDate: z.string().date().min(1),
  endDate: z.string().date().min(1),
  startTime: z.string().time().min(1),
  endTime: z.string().time().min(1),
  rooms: z.string().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default function AddDefenseSlot({ onAdd, onCancel }: Props) {
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      rooms: "",
    },
  });
  // const [formData, setFormData] = useState<FormData>({
  //   startDate: "",
  //   endDate: "",
  //   startTime: "",
  //   endTime: "",
  //   rooms: "",
  // });

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   onAdd(formData);
  // };

  // const handleCancel = () => {
  //   onCancel();
  // };

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "500px" }}>
      <h3>Add Jurie Slot</h3>
      <Form
      onSubmit={}
      >
      <Form.Group className="mb-3">
        <Form.Label>First Day</Form.Label>
        <Form.Control
        {...form.register("startDate", { required: true })}
        type="date"
        name="startDate"
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Last Day</Form.Label>
        <Form.Control
        {...form.register("endDate", { required: true })}
        type="date"
        name="endDate"
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Starting Time</Form.Label>
        <Form.Control
        {...form.register("startTime", { required: true })}
        type="time"
        name="startTime"
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ending Time</Form.Label>
        <Form.Control
        {...form.register("endTime", { required: true })}
        type="time"
        name="endTime"
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Rooms (Comma-separated)</Form.Label>
        <Form.Control
        {...form.register("rooms", { required: true })}
        type="text"
        name="rooms"
        placeholder="e.g., N101, N102, N103"
        required
        />
      </Form.Group>
      <Button type="submit" className="me-2">
        Add Slot
      </Button>
      <Button type="reset" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      </Form>
    </Container>
  );
}
