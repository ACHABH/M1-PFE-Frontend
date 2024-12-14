import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { forwardRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import AddModal, { type Ref } from "../../layout/add-modal";


const TemplateSchema = z.object({
    id: z.number().min(1),
    subject: z.string().min(1),
    content: z.string().min(1),
  });
  
type ZodTemplateSchema = z.infer<typeof TemplateSchema>;

const FormSchema = z.object({
    id: z.number().min(1),
    receiver: z.string().min(1),
    subject: z.string().min(1),
    content: z.string().min(1),
});
  
type ZodFormSchema = z.infer<typeof FormSchema>;

type Props = {
    email: ZodFormSchema;
    template: ZodTemplateSchema[];
    isEdit: boolean;
    onClose: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<Ref, Props>(({ email, template , onClose, isEdit }, ref) => {
    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: email?.id || 0,
            receiver: email?.receiver || "",
            subject: email?.subject || (isEdit ? "" : template[0]?.subject || ""),
            content: email?.content || (isEdit ? "" : template[0]?.content || ""),
        },
        values: {
            id: email.id ?? "",
            receiver: email.receiver ?? "",
            subject: email.subject ?? "",
            content: email.content ?? "",
        },
    });

    const templateForm = useForm<ZodTemplateSchema>({
        resolver: zodResolver(TemplateSchema),
        defaultValues: {
          id: template[0]?.id ?? "",
          subject: template[0]?.subject ?? "",
          content: template[0]?.content ?? "",
        },
        values: {
          id: template[0]?.id ?? "",
          subject: template[0]?.subject ?? "",
          content: template[0]?.content ?? "",
        },
    });

    const selectedTemplateId = templateForm.watch("id");

    const selectedTemplate = template.find(
        (t) => t.id === Number(selectedTemplateId)
    );
    useEffect(() => {
        if (selectedTemplate) {
            form.setValue("subject", selectedTemplate.subject);
            form.setValue("content", selectedTemplate.content);
        } else {
            templateForm.setValue("subject", "");
            templateForm.setValue("content", "");
        }
    }, [selectedTemplate, form, templateForm]);

    return (
        <AddModal ref={ref} title={email ? "Update Schedule" : "Add New Schedule"} action={null}>
            <Form onSubmit={() => console.log(email)}>
            <div className="d-flex flex-wrap justify-content-between">
                <Form.Group className="mb-3" style={{ maxWidth: "47%" }}>
                    <Form.Label>Template (Optional)</Form.Label>
                    <Form.Select aria-label="Default select example" {...templateForm.register("id")} name="id">
                    <option value="">-- Select a Template --</option>
                    {template.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.subject}
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
            <Form.Label>Subject</Form.Label>
            <Form.Control
                {...form.register("subject", { required: true })}
                type="text"
                readOnly={!!selectedTemplate}
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
                {...form.register("content", { required: true })}
                as="textarea"
                name="description"
                rows={4}
                readOnly={!!selectedTemplate}
            />
            </Form.Group>
            <Button type="submit" className="me-2" variant="success">
                {email ? "Update" : "Add"}
            </Button>
            <Button type="reset" variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            </Form>
        </AddModal>
    );
});
