import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";

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
    <div
      className="container my-4 bg-white shadow p-3 rounded"
      style={{ width: "500px" }}
    >
      <h3>Add Jurie Slot</h3>
      <form
        onSubmit={form.onSubmit(async (data) => {
          console.log(data);
          onAdd();
        })}
      >
        <div className="mb-3">
          <label className="form-label">First Day</label>
          <input
            {...form.register("startDate", { required: true })}
            type="date"
            className="form-control"
            name="date"
            // value={formData.startDate}
            // onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Day</label>
          <input
            {...form.register("endDate", { required: true })}
            type="date"
            className="form-control"
            name="date"
            // value={formData.endDate}
            // onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Starting Time</label>
          <input
            {...form.register("startTime", { required: true })}
            type="time"
            className="form-control"
            name="time"
            // value={formData.startTime}
            // onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ending Time</label>
          <input
            {...form.register("endTime", { required: true })}
            type="time"
            className="form-control"
            name="time"
            // value={formData.endTime}
            // onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rooms (Comma-separated)</label>
          <input
            {...form.register("rooms", { required: true })}
            type="text"
            className="form-control"
            name="rooms"
            // value={formData.rooms}
            // onChange={handleChange}
            placeholder="e.g., N101, N102, N103"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Add Slot
        </button>
        <button type="reset" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
