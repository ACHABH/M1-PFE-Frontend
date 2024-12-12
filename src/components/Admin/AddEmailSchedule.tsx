import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { useEffect } from "react";

type Props = {
  templates: { id: number; title: string; description: string }[];
  onAdd: (data: any) => void;
  onCancel: () => void;
};

const FormSchema = z.object({
  templateId: z.union([z.string().optional(), z.number()]),
  receiver: z.string().min(1),
  sendWhen: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  // date: z.string().optional(),
  // time: z.string().optional(),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default function AddEmailSchedule({ templates, onAdd, onCancel }: Props) {
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      templateId: "",
      receiver: "",
      sendWhen: "Right Now",
      title: "",
      description: "",
      // date: "",
      // time: "",
    },
  });

  const selectedTemplateId = form.watch("templateId");

  const selectedTemplate = templates.find(
    (template) => template.id === Number(selectedTemplateId)
  );

  // Update title and description when a template is selected
  useEffect(() => {
    if (selectedTemplate) {
      form.setValue("title", selectedTemplate.title);
      form.setValue("description", selectedTemplate.description);
    } else {
      form.setValue("title", "");
      form.setValue("description", "");
    }
  }, [selectedTemplate, form]);

  return (
    <>
      <div
        className="container my-4 component-bg shadow p-3 rounded"
        style={{ width: "500px" }}
      >
        <h3>Add Email Schedule</h3>
        <form
          onSubmit={form.onSubmit((data) => {
            onAdd(data);
          })}
        >
          <div className="d-flex flex-wrap justify-content-between">
            <div className="mb-3" style={{maxWidth:"47%"}}>
              <label className="form-label">Template (Optional)</label>
              <select
                {...form.register("templateId")}
                className="form-select"
                name="templateId"
              >
                <option value="">-- Select a Template --</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3" style={{width:"47%"}}>
              <label className="form-label">Receiver</label>
              <select
                {...form.register("receiver", { required: true })}
                className="form-select"
                name="receiver"
                required
              >
                {["All", "Students", "Teachers", "Companies"].map((receiver) => (
                  <option key={receiver} value={receiver}>
                    {receiver}
                  </option>
                ))}
              </select>
            </div>
          </div>
          

          {/* Title (Read-Only if template selected) */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              {...form.register("title", { required: true })}
              type="text"
              className="form-control"
              name="title"
              readOnly={!!selectedTemplate}
              required
            />
          </div>

          {/* Description (Read-Only if template selected) */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              {...form.register("description", { required: true })}
              className="form-control"
              name="description"
              rows={4}
              readOnly={!!selectedTemplate}
              required
            ></textarea>
          </div>

          {/* Send When */}
          {/* <div className="mb-3">
            <label className="form-label">Send When</label>
            <select
              {...form.register("sendWhen", { required: true })}
              className="form-select"
              name="sendWhen"
              required
            >
              {["Right Now", "Specified"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {form.watch("sendWhen") === "Specified" && (
            <div className="d-flex justify-content-between">
              <div className="mb-3" style={{ width: "47%" }}>
                <label className="form-label">Date</label>
                <input
                  {...form.register("date")}
                  type="date"
                  className="form-control"
                  name="date"
                />
              </div>
              <div className="mb-3" style={{ width: "47%" }}>
                <label className="form-label">Time</label>
                <input
                  {...form.register("time")}
                  type="time"
                  className="form-control"
                  name="time"
                />
              </div>
            </div>
          )} */}

          <button type="submit" className="btn btn-primary me-2">
            Add Schedule
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
      <style>
        {`
        .container {
          max-width: 600px;
        }
        `}
      </style>
    </>
  );
}
