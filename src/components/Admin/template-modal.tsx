import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import {
  useCreate as useCreateTemplate,
  useGetOne as useGetOneTemplate,
  useUpdate as useUpdateTemplate,
} from "../../api/email/template";
import { useGetAll as useGetAllUsers } from "../../api/user";
import AddModal, { type Ref } from "../../layout/add-modal";
import { useSend as useSendEmail } from "../../api/email";

// eslint-disable-next-line react-refresh/only-export-components
const FormSchema = z.object({
  subject: z.string().trim().min(1),
  content: z.string().trim().min(1),
  to: z.string().trim().min(0),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

type Props = {
  isSendingEmail: boolean;
  templateId: number | null;
  onClose: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<Ref, Props>(
  ({ isSendingEmail, templateId, onClose }, ref) => {
    const { data: users } = useGetAllUsers();
    const { data: template } = useGetOneTemplate(templateId ?? 0);

    const { mutateAsync: createTemplate } = useCreateTemplate();
    const { mutateAsync: updateTemplate } = useUpdateTemplate();

    const { mutateAsync: sendEmail } = useSendEmail();

    const form = useForm<ZodFormSchema>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        subject: template?.subject ?? "",
        content: template?.content ?? "",
        to: "",
      },
      values: {
        subject: template?.subject ?? "",
        content: template?.content ?? "",
        to: "",
      },
    });

    return (
      <AddModal
        ref={ref}
        title={
          isSendingEmail
            ? "Send Email"
            : template
              ? "Update Template"
              : "Create Template"
        }
        action={null}
      >
        <Form
          onSubmit={form.onSubmit(async (data) => {
            if (isSendingEmail) {
              if (
                data.to !== "all" &&
                data.to !== "students" &&
                data.to !== "teachers" &&
                data.to !== "companies" &&
                data.to !== "admins"
              ) {
                await sendEmail({ ...data, to: data.to! });
              } else {
                await Promise.all(
                  users.map((user) => {
                    if (data.to === "all")
                      return sendEmail({ ...data, to: user.email });
                    else if (data.to === "students" && user.role === "student")
                      return sendEmail({ ...data, to: user.email });
                    else if (data.to === "teachers" && user.role === "teacher")
                      return sendEmail({ ...data, to: user.email });
                    else if (data.to === "companies" && user.role === "company")
                      return sendEmail({ ...data, to: user.email });
                    else if (data.to === "admins" && user.role === "admin")
                      return sendEmail({ ...data, to: user.email });
                  })
                );
              }
            } else if (template) {
              await updateTemplate({ id: templateId!, body: data });
            } else {
              await createTemplate(data);
            }
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
          {isSendingEmail && (
            <Form.Group className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Select {...form.register("to", { required: true })}>
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="companies">Companies</option>
                <option value="admins">Admins</option>
                {users.map((user) =>
                  user.role === "admin" || user.role === "owner" ? null : (
                    <option key={user.email} value={user.email}>
                      {user.first_name} {user.last_name} | {user.email}
                    </option>
                  )
                )}
              </Form.Select>
              {form.formState.errors.to?.message && (
                <Form.Text>{form.formState.errors.to.message}</Form.Text>
              )}
            </Form.Group>
          )}
          <Container as="div" style={{ display: "flex", gap: 5 }}>
            <Button type="submit" variant="success" disabled={form.disabled}>
              {isSendingEmail ? "Send" : template ? "Update" : "Create"}
            </Button>
            <Button type="reset" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Container>
        </Form>
      </AddModal>
    );
  }
);
