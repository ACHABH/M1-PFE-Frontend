import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { forwardRef} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import AddModal, { type Ref } from "../../layout/add-modal";
import {
    useGetOne as useGetOneProjects,
  } from "../../api/project";

type Props = {
    projectId: number;
    onClose: () => void;
  };
  
const FormSchema = z.object({
    note: z.number().gte(0).lte(20),
});
  
type ZodFormSchema = z.infer<typeof FormSchema>;

export default forwardRef<Ref, Props>(({ projectId, onClose }, ref) => {

    const { data: project } = useGetOneProjects(projectId);

    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            note: project?.project_note?.note ?? 0,
        },
        values: {
            note: project?.project_note?.note ?? 0,
        },
    });

    return(
        <AddModal ref={ref} title="Set Note" action={null}>
            <Form
                onSubmit={form.onSubmit(() => {
                    form.reset();
                    onClose();
                })}
            >
                <Form.Group className="mb-3">
                    <Form.Label>Project Note</Form.Label>
                    <Form.Control
                        type="number"
                        {...form.register("note", { required: true })}
                    />
                </Form.Group>
                <Container as="div" style={{ display: "flex", gap: 5 }}>
                    <Button type="submit" variant="success">
                        Confirm
                    </Button>
                    <Button type="reset" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Container>
            </Form>
        </AddModal>
    )

});