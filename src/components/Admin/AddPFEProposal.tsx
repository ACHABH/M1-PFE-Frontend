import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { PROJECT_TYPE } from "../../constant/enum";

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
    <div
      className="container my-4 bg-white shadow p-3 rounded"
      style={{ width: "400px" }}
    >
      <h3>Add PFE Proposal</h3>
      <form
        onSubmit={form.onSubmit((data) => {
          console.log(data);
          onAdd();
        })}
      >
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            {...form.register("title", { required: true })}
            type="text"
            className="form-control"
            name="title"
            // value={formData.title}
            // onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            {...form.register("type", { required: true })}
            className="form-select"
            name="type"
            // value={formData.type}
            // onChange={handleChange}
            required
          >
            {PROJECT_TYPE.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            {...form.register("description", { required: true })}
            className="form-control"
            name="description"
            // value={formData.description}
            // onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Add Proposal
        </button>
        <button type="reset" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
