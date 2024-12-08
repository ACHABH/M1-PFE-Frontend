import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { zodResolver } from "@hookform/resolvers/zod";
import isStrongPassword from "validator/lib/isStrongPassword";
import { z } from "zod";
import { useMemo } from "react";
import { useForm } from "../../../hooks/useForm";
import {
  STUDENT_MAJOR,
  TEACHER_GRADE,
  USER_ROLE,
} from "../../../constant/enum";
import { useCreate as useCreateUser } from "../../../api/user";

const FormSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
  password_confirmation: z.string().trim().min(1),
  role: z.enum(USER_ROLE),
  // Student
  student_major: z.enum(STUDENT_MAJOR).nullable(),
  student_average_score: z.coerce.number().min(0).nullable(),
  // Teacher
  teacher_recruitment_date: z.string().trim().min(1).date().nullable(),
  teacher_grade: z.enum(TEACHER_GRADE).nullable(),
  // Company
  company_name: z.string().trim().min(1).nullable(),
  company_number: z.string().trim().min(1).nullable(),
});

export type ZodFormSchema = z.infer<typeof FormSchema>;

export const Route = createLazyFileRoute("/dashboard/admin/add-user")({
  component: Component,
});

function Component() {
  const { mutateAsync: createUser } = useCreateUser();

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "student",
      password: "",
      password_confirmation: "",
      student_major: null,
      student_average_score: null,
      teacher_recruitment_date: null,
      teacher_grade: null,
      company_name: null,
      company_number: null,
    },
  });

  const isPasswordStrong = useMemo(
    () => isStrongPassword(form.watch("password")),
    [form]
  );

  return (
    <Form
      onSubmit={form.onSubmit((data) => createUser(data))}
      className="d-flex justify-content-between flex-wrap bg-white p-4 shadow my-4"
      style={{
        width: "60%",
        margin: "auto",
        borderRadius: "20px",
        border: "1.5px solid #ccc",
      }}
    >
      <Form.Group className="mb-3" style={{width: "47%"}}>
        <Form.Label htmlFor="role">Who Is He?</Form.Label>
        <Form.Select
          {...form.register("role", { required: true })}
          onChange={(e) => {
            // Student
            form.setValue("student_major", null);
            form.setValue("student_average_score", null);
            // Teacher
            form.setValue("teacher_recruitment_date", null);
            form.setValue("teacher_grade", null);
            // Company
            form.setValue("company_name", null);
            form.setValue("company_number", null);
            form.register("role").onChange(e);
          }}
          required
          // value={USER_ROLE[0]}
        >
          {USER_ROLE.map((role) =>
            role === "owner" || role === "admin" ? null : (
              <option
                key={role}
                value={role}
                style={{ textTransform: "capitalize" }}
              >
                {role}
              </option>
            )
          )}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" style={{width: "47%"}}>
        <Form.Label htmlFor="first-name">First name</Form.Label>
        <Form.Control
          {...form.register("first_name", { required: true })}
          name="first-name"
          type="text"
          placeholder="First name"
          required
        />
        {form.formState.errors.first_name?.message && (
          <Form.Text>{form.formState.errors.first_name?.message}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" style={{width: "47%"}}>
        <Form.Label htmlFor="last-name">Last name</Form.Label>
        <Form.Control
          {...form.register("last_name", { required: true })}
          name="last-name"
          type="text"
          placeholder="Last name"
          required
        />
        {form.formState.errors.last_name?.message && (
          <Form.Text>{form.formState.errors.last_name?.message}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" style={{width: "47%"}}>
        <Form.Label htmlFor="email">Email address</Form.Label>
        <Form.Control
          {...form.register("email", { required: true })}
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        {form.formState.errors.email?.message && (
          <Form.Text>{form.formState.errors.email?.message}</Form.Text>
        )}
      </Form.Group>

      {/* Specific Fields Based On The Role */}
      {form.watch("role") === "student" && (
        <>
          <Form.Group className="mb-3" style={{width: "47%"}}>
            <Form.Label htmlFor="student_major">Master's Option</Form.Label>
            <Form.Select
              {...form.register("student_major", { required: true })}
              required
              value={STUDENT_MAJOR[0]}
            >
              {STUDENT_MAJOR.map((major) => (
                <option
                  key={major}
                  value={major}
                  style={{ textTransform: "uppercase" }}
                >
                  {major}
                </option>
              ))}
            </Form.Select>
            {form.formState.errors.student_major?.message && (
              <Form.Text>
                {form.formState.errors.student_major?.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" style={{width: "47%"}}>
            <Form.Label htmlFor="student_average_score">
              Average Score (Master's 1)
            </Form.Label>
            <Form.Control
              type="number"
              {...form.register("student_average_score", { required: true })}
              placeholder="Average Score"
              required
            />
            {form.formState.errors.student_average_score?.message && (
              <Form.Text>
                {form.formState.errors.student_average_score?.message}
              </Form.Text>
            )}
          </Form.Group>
        </>
      )}
      {form.watch("role") === "teacher" && (
        <>
          <Form.Group className="mb-3" style={{width: "47%"}}>
            <Form.Label htmlFor="teacher_recruitment_date">
              Recruitment Date
            </Form.Label>
            <Form.Control
              {...form.register("teacher_recruitment_date", { required: true })}
              type="date"
              required
            />
            {form.formState.errors.teacher_recruitment_date?.message && (
              <Form.Text>
                {form.formState.errors.teacher_recruitment_date?.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" style={{width: "47%"}}>
            <Form.Label htmlFor="teacher_grade">Grade</Form.Label>
            <Form.Select
              {...form.register("teacher_grade", { required: true })}
              required
              value={TEACHER_GRADE[0]}
            >
              {TEACHER_GRADE.map((grade) => (
                <option
                  key={grade}
                  value={grade}
                  style={{ textTransform: "uppercase" }}
                >
                  {grade}
                </option>
              ))}
            </Form.Select>
            {form.formState.errors.teacher_grade?.message && (
              <Form.Text>
                {form.formState.errors.teacher_grade?.message}
              </Form.Text>
            )}
          </Form.Group>
        </>
      )}
      {form.watch("role") === "company" && (
        <>
          <Form.Group className="mb-3" style={{width: "47%"}}>
            <Form.Label htmlFor="company_name">Company Name</Form.Label>
            <Form.Control
              {...form.register("company_name")}
              type="text"
              placeholder="Company Name"
              required
            />
            {form.formState.errors.company_name?.message && (
              <Form.Text>
                {form.formState.errors.company_name?.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" style={{width: "47%"}}>
            <Form.Label htmlFor="company_number">Company number</Form.Label>
            <Form.Control
              {...form.register("company_number", { required: true })}
              type="tel"
              placeholder="Company Number"
              required
            />
            {form.formState.errors.company_number?.message && (
              <Form.Text>
                {form.formState.errors.company_number?.message}
              </Form.Text>
            )}
          </Form.Group>
        </>
      )}
      <Form.Group className="mb-3" style={{width: "47%"}}>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          {...form.register("password", { required: true })}
          type="password"
          placeholder="Password"
          required
        />
        {form.formState.errors.password?.message && (
          <Form.Text>{form.formState.errors.password?.message}</Form.Text>
        )}
        {!isPasswordStrong && (
          <Form.Text>Make sure to create a strong password</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" style={{width: "47%"}}>
        <Form.Label htmlFor="password-confirmation">
          Confirm Password
        </Form.Label>
        <Form.Control
          {...form.register("password_confirmation", { required: true })}
          type="password"
          placeholder="Confirm password"
          required
        />
        {form.formState.errors.password_confirmation?.message && (
          <Form.Text>
            {form.formState.errors.password_confirmation?.message}
          </Form.Text>
        )}
        {!isPasswordStrong && (
          <Form.Text>Make sure to create a strong password</Form.Text>
        )}
      </Form.Group>
      <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
        <Button variant="primary" type="submit" disabled={form.disabled}>
          Create User
        </Button>
        <Button variant="secondary" className='mx-2' type="reset" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </Stack>
    </Form>
  );
}