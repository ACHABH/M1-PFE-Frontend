import { createLazyFileRoute } from "@tanstack/react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { STUDENT_MAJOR, TEACHER_GRADE } from "../../constant/enum";
import { useAuth } from "../../api/auth";
import { useForm } from "../../hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useUpdate as useUpdateUser,
  useDelete as useDeleteUser,
} from "../../api/user";

export const Route = createLazyFileRoute("/dashboard/")({
  component: Component,
});

const FormSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

function Component() {
  const user = useAuth();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    },
    values: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    },
  });

  return (
    <Container
      as="div"
      className="component-bg p-3 mx-auto mt-4 rounded shadow"
    >
      <h3>Profile</h3>
      <Form onSubmit={form.onSubmit((data) => updateUser({ body: data }))}>
        <Form.Group className="mb-3" controlId="fName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            {...form.register("first_name", { required: true })}
            type="text"
            placeholder="Ahmed"
          />
          {form.formState.errors.first_name?.message && (
            <Form.Text>{form.formState.errors.first_name.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="lName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            {...form.register("last_name", { required: true })}
            type="text"
            placeholder="Family"
          />
          {form.formState.errors.last_name?.message && (
            <Form.Text>{form.formState.errors.last_name.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            disabled
            readOnly
          />
        </Form.Group>
        {user?.role === "student" && (
          <>
            <Form.Group className="mb-3" controlId="avgScore">
              <Form.Label>Average Score</Form.Label>
              <Form.Control type="text" placeholder="14" disabled readOnly />
            </Form.Group>
            <Form.Select className="mb-3">
              {STUDENT_MAJOR.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </Form.Select>
          </>
        )}
        {user?.role === "teacher" && (
          <>
            <Form.Group className="mb-3" controlId="recruitmentDate">
              <Form.Label>Recruitment Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="YYYY-MM-DD"
                disabled
                readOnly
              />
            </Form.Group>
            <Form.Select className="mb-3">
              {TEACHER_GRADE.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </Form.Select>
          </>
        )}
        {user?.role === "company" && (
          <>
            <Form.Group className="mb-3" controlId="companyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="text" placeholder="Company Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="companyNumber">
              <Form.Label>Company Number</Form.Label>
              <Form.Control type="text" placeholder="Company Number" />
            </Form.Group>
          </>
        )}
        <Container
          as="div"
          style={{
            display: "flex",
            gap: 5,
          }}
        >
          <Button variant="primary" type="submit" disabled={form.disabled}>
            Update
          </Button>
          <Button
            variant="danger"
            type="reset"
            onClick={async () => {
              const confirmation = window.confirm("Confirm profile delete?");
              if (confirmation) await deleteUser(undefined);
            }}
          >
            Delete
          </Button>
        </Container>
      </Form>
    </Container>
  );
}
