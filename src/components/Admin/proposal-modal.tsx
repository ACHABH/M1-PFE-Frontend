import { Form, Button, Container } from 'react-bootstrap';
import AddModal, { type Ref } from "../../layout/add-modal";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PROJECT_TYPE } from "../../constant/enum";
import { useForm } from "../../hooks/useForm";
import {
    useGetOne as useGetProposal,
} from "../../api/project";

const FormSchema = z.object({
  type: z.enum(PROJECT_TYPE),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

type Props = {
  proposalID: number;
  onClose: () => void;
};

export default forwardRef<Ref, Props>(({ proposalID = 0, onClose }, ref) => {
    const { data: proposal } = useGetProposal(proposalID);
    
    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        type: proposal?.type ?? "classical",
        title: proposal?.title ?? "",
        description: proposal?.description ?? "",
        },
        values: {
        type: proposal?.type ?? "classical",
        title: proposal?.title ?? "",
        description: proposal?.description ?? "",
        },
    });
    
    return (
        <AddModal ref={ref} title={proposal ? "Update Proposal" : "Add Proposal"} action={null}>
        <Form
        onSubmit={() => console.log(proposal)}
        >
            <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select {...form.register("type", { required: true })}>
                <option value="classical">Classical</option>
                <option value="innovative">Innovative</option>
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
                    {proposal ? "Update" : "Add"}
                </Button>
                <Button type="reset" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Container>
        </Form>
        </AddModal>
    );
});

