import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { PROJECT_TYPE } from "../../constant/enum";
import { Form, Button, Container } from "react-bootstrap";

type Props = {
  onAdd: () => void;
  onCancel: () => void;
};

const FormSchema = z.object({
  type: z.enum(PROJECT_TYPE),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default function AddPFEProposal({ onAdd, onCancel }: Props) {
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      type: "classical",
      description: "",
    },
  });

  // const [formData, setFormData] = useState<FormData>({
  //   title: "",
  //   type: "Classic",
  //   description: "",
  // });

  // const handleChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   onAdd(formData);
  //   setFormData({ title: "", type: "Classic", description: "" });
  // };

  // const handleCancel = () => {
  //   onCancel();
  // };

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "400px" }}>
      <h3>Add PFE Proposal</h3>
      <Form
      onSubmit={form.onSubmit((data) => {
        console.log(data);
        onAdd();
      })}
      >
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
        {...form.register("title", { required: true })}
        type="text"
        name="title"
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Select
        {...form.register("type", { required: true })}
        name="type"
        required
        >
        {PROJECT_TYPE.map((type) => (
          <option key={type} value={type}>
          {type}
          </option>
        ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
        {...form.register("description", { required: true })}
        as="textarea"
        name="description"
        required
        />
      </Form.Group>
      <Button type="submit" className="me-2" variant="primary">
        Add Proposal
      </Button>
      <Button type="reset" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      </Form>
    </Container>
  );
}
