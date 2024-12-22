import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { forwardRef, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import {
    useGetAll as useGetAll,
    useCreate as useCreateUser,
    useUpdate as useUpdateUser,
} from "../../api/user";
import AddModal, { type Ref } from "../../layout/add-modal";

type Props = {
  userId: number;
  onClose: () => void;
};

const FormSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default forwardRef<Ref, Props>(({ userId = 0, onClose }, ref) => {
    const { data: users } = useGetAll();
    const { mutateAsync: createUser } = useCreateUser();
    const { mutateAsync: updateUser } = useUpdateUser();


    const user = useMemo(() => users?.find((user) => user.id === userId), [users, userId]);
    
    const form = useForm<ZodFormSchema>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        email: user?.email ?? "",
        password: user?.password ?? "",
        },
        values: {
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        email: user?.email ?? "",
        password: user?.password ?? "",
        },
    });
    
    return (
        <AddModal ref={ref} title={user ? "Update User" : "Add User"} action={null}>
        <Form
            onSubmit={form.onSubmit(async (data) => {
                if (user) await updateUser({ user_id: userId, body: data });
                else await createUser(data);
                form.reset();
                onClose();
            })}
        >
            <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
                type="text"
                {...form.register("first_name", { required: true })}
                placeholder="First Name"
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
                type="text"
                {...form.register("last_name", { required: true })}
                placeholder="Last Name"
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="email"
                {...form.register("email", { required: true })}
                placeholder="Email"
            />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                {...form.register("password", { required: true })}
                placeholder="Password"
            />
            </Form.Group>
            <Container as="div" className="d-flex justify-content-end">
            <Button type="submit" variant="primary">
                {user ? "Update" : "Create"}
            </Button>
            </Container>
        </Form>
        </AddModal>
    );
});