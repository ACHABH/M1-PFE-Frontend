import { Form, Button } from 'react-bootstrap';
import AddModal, { type Ref } from "../../layout/add-modal";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";

const FormSchema = z.object({
    start: z.string().datetime().min(1),
    end: z.string().datetime().min(1),
    rooms: z.string().min(1),
});
  
type ZodFormSchema = z.infer<typeof FormSchema>;

type Props = {
    defenseSlot: ZodFormSchema ;
    onClose: () => void;
};

export default forwardRef<Ref, Props>(({ defenseSlot , onClose }, ref) => {
    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            start: defenseSlot?.start ?? "",
            end: defenseSlot?.end ?? "",
            rooms: defenseSlot?.rooms ?? "",
        },
        values: {
            start: defenseSlot?.start ?? "",
            end: defenseSlot?.end ?? "",
            rooms: defenseSlot?.rooms ?? "",
        },
    });

    return (
        // <AddModal ref={ref} title={defenseSlot ? "Update Defense Slot" : "Add Defense Slot"} action={null}>
        <AddModal ref={ref} title="Add Defense Slot" action={null}>
        
            <Form onSubmit={() => console.log(defenseSlot)}>
                <Form.Group className="mb-3">
                    <Form.Label>Starting Date</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        {...form.register("start", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Date</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        {...form.register("end", { required: true })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Rooms <span className='text-secondary'>(Comma-separated)</span></Form.Label>
                    <Form.Control
                        type="text"
                        {...form.register("rooms", { required: true })}
                        placeholder="e.g., N101, N102, N103"
                    />
                </Form.Group>
                <Button type="submit" className="me-2" variant="success">
                    {/* {defenseSlot ? "Update" : "Add"} */}
                    Add
                </Button>
                <Button type="reset" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Form>
        </AddModal>
    );
});