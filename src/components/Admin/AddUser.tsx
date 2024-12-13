import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { USER_ROLE } from "../../constant/enum";
import { Container, Form, Button } from "react-bootstrap";

type Props = {
  onAdd: () => void;
};

const FormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().min(1).email(),
  role: z.enum(USER_ROLE),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default function AddUser({ onAdd }: Props) {
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "student",
    },
  });

  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   role: 'Student', // Default role
  // });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onAdd(formData); // Call parent function to handle the addition
  //   setFormData({ name: '', email: '', role: 'Student' }); // Reset form
  // };

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "400px" }}>
    <h3>Add User</h3>
    <Form
    >
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          {...form.register("name", { required: true })}
          type="text"
          name="name"
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          {...form.register("email", { required: true })}
          type="email"
          name="email"
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Select
          {...form.register("role", { required: true })}
          name="role"
          required
        >
          {USER_ROLE.map((role) =>
            role === "admin" || role === "owner" ? null : (
              <option key={role} value={role}>
                {role}
              </option>
            )
          )}
        </Form.Select>
      </Form.Group>
      <Button type="submit" className="me-2" variant="primary">
        Add User
      </Button>
    </Form>
  </Container>
  );
}
