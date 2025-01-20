import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../api/auth";
import { sql } from "../../../api/sql.ts";
import { STUDENT_MAJOR } from "../../../constant/enum";

export const Route = createLazyFileRoute("/dashboard/student/propose-topic")({
  component: Component,
});

// Zod schema for form validation
const FormSchema = z.object({
  studentFirstName: z.string().trim().min(1, "First name is required"),
  studentLastName: z.string().trim().min(1, "Last name is required"),
  binomeFirstName: z.string().trim().optional(),
  binomeLastName: z.string().trim().optional(),
  specialty: z.string().trim().min(1, "Specialty is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  technologies: z.string().trim().min(1, "Technologies are required"),
  materials: z.string().trim().min(1, "Materials are required"),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

function Component() {
  const user = useAuth((user) => {
    if (user) return;
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentFirstName: user?.first_name,
      studentLastName: user?.last_name,
      binomeFirstName: "",
      binomeLastName: "",
      specialty: "",
      title: "",
      description: "",
      technologies: "",
      materials: "",
    },
  });

  const [submissionReminder, setSubmissionReminder] = useState(false);

  // Simulated Reminder Logic
  useEffect(() => {
    const deadline = new Date("2025-12-30"); // Proposal deadline
    const now = new Date();
    if (now < deadline) {
      setSubmissionReminder(true);
    }
  }, []);

  async function getBinomeId(data: ZodFormSchema) {
    if (!data.binomeFirstName || !data.binomeLastName) return null;

    const binomeQuery = `
      SELECT id FROM users 
      WHERE first_name = '${data.binomeFirstName}' 
      AND last_name = '${data.binomeLastName}' 
      LIMIT 1;
    `;
    const binomeResult = await sql("select", binomeQuery);
    const binomeId = binomeResult.data[0]?.id;
    if (!binomeId) {
      alert("Binome not found.");
      throw new Error("Binome not found.");
    }
    return binomeId;
  }

  async function createGroup(studentId: number, binomeId: number | null) {
    const insertGroupQuery = `
      INSERT INTO groups DEFAULT VALUES;
    `;
    const groupResult = await sql("insert", insertGroupQuery);

    const groupId = groupResult.data.last_insert_rowid;

    const insertStudentQuery = `
      INSERT INTO group_members (student_id, group_id)
      VALUES (${studentId}, ${groupId});
    `;
    await sql("insert", insertStudentQuery);

    if (binomeId) {
      const insertBinomeQuery = `
        INSERT INTO group_members (student_id, group_id)
        VALUES (${binomeId}, ${groupId});
      `;
      await sql("insert", insertBinomeQuery);
    }
    return groupId;
  }

  async function getProjectId() {
    const lastProjectIdQuery = `SELECT COUNT(*) as count FROM projects;`;
    const lastProjectIdResult = await sql("select", lastProjectIdQuery);
    const count = lastProjectIdResult.data[0]?.count;
    const lastProjectId = count ? parseInt(count, 10) + 1 : 1;
    return lastProjectId;
  }

  const onSubmit = async (data: ZodFormSchema) => {
    try {
      const lastProjectId = await getProjectId();
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const query = `
        INSERT INTO projects (title, description, type, status, technologies, material_needs, master_option, created_at)
        VALUES (
          '${data.title.replace(/'/g, "''")}', 
          '${data.description.replace(/'/g, "''")}', 
          'STUDENT_PROPOSAL', 
          'PROPOSED', 
          '${data.technologies.replace(/'/g, "''")}', 
          '${data.materials.replace(/'/g, "''")}', 
          '${data.specialty.toUpperCase().replace(/'/g, "''")}',
          '${formattedDate}'
        )
      `;

      const query2 = `
        INSERT INTO project_propositions 
        (user_id, project_id, status, validated_by)
        VALUES (
          ${user?.id},
          ${lastProjectId},
          'pending',
          1
        )
      `;

      const result = await sql("insert", query);
      const result2 = await sql("insert", query2);
      const result3 = await createGroup( user?.id , getBinomeId(data));
      
      console.log("Proposal submitted:", result);
      console.log("Proposal proposition:", result2);
      console.log("Proposal proposition:", result3);
      alert("Proposal submitted successfully!");
      reset();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to submit the proposal. Please try again.");
    }
  };

  return (
    <Container className="my-3 component-bg rounded p-3" style={{ width: "90%" }}>
      <h3>Submit Your Topic Proposal</h3>
      {submissionReminder && (
        <div className="alert alert-warning" role="alert">
          <strong>Reminder:</strong> The deadline for submitting PFE proposals is December 30, 2024.
        </div>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="studentFirstName">
              <Form.Label>Student First Name</Form.Label>
              <Controller
                name="studentFirstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter your first name"
                    isInvalid={!!errors.studentFirstName}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.studentFirstName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="studentLastName">
              <Form.Label>Student Last Name</Form.Label>
              <Controller
                name="studentLastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter your last name"
                    isInvalid={!!errors.studentLastName}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.studentLastName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="binomeFirstName">
              <Form.Label>Binome First Name</Form.Label>
              <Controller
                name="binomeFirstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter binome's first name (optional)"
                  />
                )}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="binomeLastName">
              <Form.Label>Binome Last Name</Form.Label>
              <Controller
                name="binomeLastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter binome's last name (optional)"
                  />
                )}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="specialty">
              <Form.Label>Specialty</Form.Label>
              <Controller
                name="specialty"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Select {...field} isInvalid={!!errors.specialty}>
                    <option value="">Select your specialty</option>
                    {STUDENT_MAJOR.map((major) => (
                      <option key={major} value={major}>
                        {major.toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.specialty?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter topic title"
                    isInvalid={!!errors.title}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="technologies">
              <Form.Label>Technologies</Form.Label>
              <Controller
                name="technologies"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter technologies to be used"
                    isInvalid={!!errors.technologies}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.technologies?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="materials">
              <Form.Label>Materials</Form.Label>
              <Controller
                name="materials"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    as="textarea"
                    rows={3}
                    placeholder="Enter any materials needed for the project"
                    isInvalid={!!errors.materials}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.materials?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    as="textarea"
                    rows={7}
                    placeholder="Enter topic description"
                    isInvalid={!!errors.description}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Container className="d-flex justify-content-end">
          <Button type="submit" variant="primary">
            Submit Proposal
          </Button>
        </Container>
      </Form>
    </Container>
  );
}