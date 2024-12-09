import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { USER_ROLE } from "../../constant/enum";

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
    <div
      className="container mt-4 bg-white shadow my-3 p-3"
      style={{ borderRadius: "15px" }}
    >
      <h3>Add User</h3>
      <form
        onSubmit={form.onSubmit((data) => {
          console.log(data);
          onAdd();
        })}
      >
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            {...form.register("name", { required: true })}
            type="text"
            className="form-control"
            name="name"
            // value={formData.name}
            // onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            {...form.register("email", { required: true })}
            type="email"
            className="form-control"
            name="email"
            // value={formData.email}
            // onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            {...form.register("role", { required: true })}
            className="form-select"
            name="role"
            // value={formData.role}
            // onChange={handleChange}
          >
            {USER_ROLE.map((role) =>
              role === "admin" || role === "owner" ? null : (
                <option key={role} value={role}>
                  {role}
                </option>
              )
            )}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add User
        </button>
      </form>
    </div>
  );
}
