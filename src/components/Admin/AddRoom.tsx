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

export default function AddRoom({ onAdd, onCancel }: Props) {
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rooms: "",
    },
  });

  return(
    <div
      className="container my-4 component-bg shadow p-3 rounded"
      style={{ width: "500px" }}
    >
      <h3>Add Room</h3>
      <form
        onSubmit={form.onSubmit(async (data) => {
          console.log(data);
          onAdd();
        })}
      >
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
          Add Rooms
        </button>
        <button type="reset" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}