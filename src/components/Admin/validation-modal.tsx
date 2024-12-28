import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { forwardRef} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import AddModal, { type Ref } from "../../layout/add-modal";
import {
    type FullProject,
    useGetOne as useGetOneProjects,
    useValidate as useValidateProject,
  } from "../../api/project";

type Props = {
    projectId: number;
    onClose: () => void;
  };
  
const FormSchema = z.object({
    registration_start: z.string().datetime(),
    registration_end: z.string().datetime(),
    presantation_start: z.string().datetime(),
    presanation_end: z.string().datetime(),
});
  
type ZodFormSchema = z.infer<typeof FormSchema>;

export default forwardRef<Ref, Props>(({ projectId, onClose }, ref) => {

    const { data: project } = useGetOneProjects(projectId);
    const { mutateAsync: validateProject } = useValidateProject();

    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            registration_start: "",
            registration_end: "",
            presantation_start: "",
            presanation_end: "",
        },
        values: {
            registration_start: "",
            registration_end: "",
            presantation_start: "",
            presanation_end: "",
        },
    });

    return(
        <AddModal ref={ref} title="Set Dates" action={null}>
            <Form
                onSubmit={form.onSubmit(async (data) => {
                    await validateProject(projectId);
                    form.reset();
                    onClose();
                })}
            >
                <Form.Group className="mb-3">
                    <Form.Label>Registration Start</Form.Label>
                    <Form.Control
                        type="datetime"
                        {...form.register("registration_start", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Registration End</Form.Label>
                    <Form.Control
                        type="datetime"
                        {...form.register("registration_end", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Presantation Start</Form.Label>
                    <Form.Control
                        type="datetime"
                        {...form.register("presantation_start", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Presanation End</Form.Label>
                    <Form.Control
                        type="datetime"
                        {...form.register("presanation_end", { required: true })}
                    />
                </Form.Group>
                <Container as="div" style={{ display: "flex", gap: 5 }}>
                    <Button type="submit" variant="success">
                        Validate
                    </Button>
                    <Button type="reset" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Container>
            </Form>
        </AddModal>
    )

});