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
    registration_end: z.string().date(),
    presantation_date: z.string().date(),
    presanation_time: z.string().time(),
    presanation_time_end: z.string().time(),
});
  
type ZodFormSchema = z.infer<typeof FormSchema>;

export default forwardRef<Ref, Props>(({ projectId, onClose }, ref) => {

    const { data: project } = useGetOneProjects(projectId);
    const { mutateAsync: validateProject } = useValidateProject();

    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            registration_end: "",
            presantation_date: "",
            presanation_time: "",
            presanation_time_end: "",
        },
        values: {
            registration_end: "",
            presantation_date: "",
            presanation_time: "",
            presanation_time_end: "",
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
                    <Form.Label>Registration End</Form.Label>
                    <Form.Control
                        type="date"
                        {...form.register("registration_end", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Presantation Date</Form.Label>
                    <Form.Control
                        type="date"
                        {...form.register("presantation_date", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Presanation Time</Form.Label>
                    <Form.Control
                        type="time"
                        {...form.register("presanation_time", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Presanation Time End</Form.Label>
                    <Form.Control
                        type="time"
                        {...form.register("presanation_time_end", { required: true })}
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