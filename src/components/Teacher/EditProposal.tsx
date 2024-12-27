import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  useGetOne as useGetOneProject, 
  useUpdate as useUpdateProject
} from "../../api/project";
import { PROJECT_TYPE } from "../../constant/enum";
import { useForm } from "../../hooks/useForm";


type Props = {
  projectID: number;
  onCancel: () => void;
};

const FormSchema = z.object({
  type: z.enum(PROJECT_TYPE),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  feedback: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;


const EditProposalForm = ({ projectID, onCancel }: Props) => {
  const { data: project } = useGetOneProject(projectID);

  const form = useForm<ZodFormSchema>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        type: project?.type ?? "classical",
        title: project?.title ?? "",
        description: project?.description ?? "",
        feedback: project?.project_proposition_feedback?.feedback ?? "",
      },
      values: {
        type: project?.type ?? "classical",
        title: project?.title ?? "",
        description: project?.description ?? "",
        feedback: project?.project_proposition_feedback?.feedback ?? "",
      },
    });

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "400px" }}>
        <h4>Edit Proposal: {project?.title ?? "Loading..."}</h4>
        <Form
        onSubmit={form.onSubmit(async (data) => {
          if (project) await updateProject({ id: projectId, body: data });
          form.reset();
          onClose();
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
            <Form.Group className="mb-3">
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                as="textarea"
                {...form.register("feedback")}
                disabled
              />
            </Form.Group>
            <Button type="submit" className="me-2" variant="success">
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
        </Form>
      </Container>
  );
};

export default EditProposalForm;
