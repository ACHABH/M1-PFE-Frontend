import { Form, Button, Container } from "react-bootstrap";
import AddModal, { type Ref } from "../../layout/add-modal";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PROJECT_TYPE } from "../../constant/enum";
import { useForm } from "../../hooks/useForm";
import {
  useGetOne as useGetOneProject,
  useCreate as useCreateProject,
  useUpdate as useUpdateProject,
} from "../../api/project";

const FormSchema = z.object({
  type: z.enum(PROJECT_TYPE),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

type Props = {
  projectId: number;
  onClose: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<Ref, Props>(({ projectId, onClose }, ref) => {
  const { data: project } = useGetOneProject(projectId);
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: updateProject } = useUpdateProject();

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: project?.type ?? "classical",
      title: project?.title ?? "",
      description: project?.description ?? "",
    },
    values: {
      type: project?.type ?? "classical",
      title: project?.title ?? "",
      description: project?.description ?? "",
    },
  });

  return (
    <AddModal
      ref={ref}
      title={project ? "Update project" : "Add project"}
      action={null}
    >
      <Form
        onSubmit={form.onSubmit(async (data) => {
          if (project) await updateProject({ id: projectId, body: data });
          else await createProject(data);
        })}
      >
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select {...form.register("type", { required: true })}>
            {PROJECT_TYPE.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            {...form.register("title", { required: true })}
            placeholder="Title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            {...form.register("description", { required: true })}
            placeholder="Description"
          />
        </Form.Group>
        <Container as="div" style={{ display: "flex", gap: 5 }}>
          <Button type="submit" variant="primary">
            {project ? "Update" : "Create"}
          </Button>
          <Button type="reset" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Container>
      </Form>
    </AddModal>
  );
});
