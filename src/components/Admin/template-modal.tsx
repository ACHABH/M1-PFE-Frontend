import { Form, Button } from "react-bootstrap";
import AddModal, { type Ref } from "../../layout/add-modal";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import {
  useCreate as useCreateTemplate,
  useGetOne as useGetOneTemplate,
  useUpdate as useUpdateTemplate,
} from "../../api/email/template";

// eslint-disable-next-line react-refresh/only-export-components
const FormSchema = z.object({
  subject: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

type Props = {
  templateId: number | null;
  onClose: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<Ref, Props>(({ templateId, onClose }, ref) => {
  const { data: template } = useGetOneTemplate(templateId ?? 0);

  const { mutateAsync: createTemplate } = useCreateTemplate();
  const { mutateAsync: updateTemplate } = useUpdateTemplate();

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: template?.subject ?? "",
      content: template?.content ?? "",
    },
    values: {
      subject: template?.subject ?? "",
      content: template?.content ?? "",
    },
  });

  return (
    <AddModal
      ref={ref}
      title={template ? "Update Template" : "Create Template"}
      action={null}
    >
      <Form
        onSubmit={form.onSubmit(async (data) => {
          if (template) await updateTemplate({ id: templateId!, body: data });
          else await createTemplate(data);
          onClose();
        })}
      >
        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            {...form.register("subject", { required: true })}
            type="text"
            placeholder="To {name}, subject"
          />
          {form.formState.errors.subject?.message && (
            <Form.Text>{form.formState.errors.subject.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            {...form.register("content", { required: true })}
            placeholder="You can use placeholders like {name} or {deadline}."
            // required
          />
          {form.formState.errors.content?.message && (
            <Form.Text>{form.formState.errors.content.message}</Form.Text>
          )}
        </Form.Group>
        <Button
          type="submit"
          variant="success"
          className="me-2"
          disabled={form.disabled}
        >
          {template ? "Update" : "Create"}
        </Button>
        <Button type="reset" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Form>
    </AddModal>
  );
});
