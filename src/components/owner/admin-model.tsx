import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useMemo } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { z } from "zod";
import { useGetAll as useGetAllUsers } from "../../api/user";
import AddModal, { type Ref } from "../../layout/add-modal";
import { useForm } from "../../hooks/useForm";
import { useCreate as useCreateAdmin } from "../../api/admin";

// eslint-disable-next-line react-refresh/only-export-components
const FormSchema = z.object({
  user_id: z.coerce.number().gt(0),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<Ref, object>((_, ref) => {
  const { data: users } = useGetAllUsers();
  const { mutateAsync: createAdmin } = useCreateAdmin();

  const nonAdmins = useMemo(() => {
    return users.filter((user) => {
      return user.role !== "admin" && user.role !== "owner";
    });
  }, [users]);

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_id: 0,
    },
  });

  return (
    <AddModal ref={ref} title="Add new admin" action={null}>
      <Form
        onSubmit={form.onSubmit(async (data) => {
          await createAdmin(data);
        })}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Form.Select {...form.register("user_id", { required: true })}>
          {nonAdmins.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </option>
          ))}
        </Form.Select>
        <Button
          type="submit"
          style={{ width: "100%" }}
          disabled={form.disabled}
        >
          Add
        </Button>
      </Form>
    </AddModal>
  );
});
