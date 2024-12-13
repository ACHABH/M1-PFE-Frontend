import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "../../hooks/useForm";
import { useEffect } from "react";
import { Form, Button } from "react-bootstrap";

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
        <Form
        >
          <div className="d-flex flex-wrap justify-content-between">
            <Form.Group className="mb-3" style={{ maxWidth: "47%" }}>
                <Form.Label>Template (Optional)</Form.Label>
                <Form.Select aria-label="Default select example" {...form.register("templateId")} name="templateId">
                  <option value="">-- Select a Template --</option>
                  {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                  ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" style={{ width: "47%" }}>
              <Form.Label>Receiver</Form.Label>
                <Form.Select
                aria-label="Receiver select"
                {...form.register("receiver", { required: true })}
                name="receiver"
                required
                >
                <option value="">-- Select Receiver --</option>
                {["All", "Students", "Teachers", "Companies"].map((receiver) => (
                  <option key={receiver} value={receiver}>
                  {receiver}
                  </option>
                ))}
                </Form.Select>
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              {...form.register("title", { required: true })}
              type="text"
              name="title"
              readOnly={!!selectedTemplate}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              {...form.register("description", { required: true })}
              as="textarea"
              name="description"
              rows={4}
              readOnly={!!selectedTemplate}
              required
            />
          </Form.Group>

          <Button type="submit" className="me-2">
            Add Schedule
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Form>
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
