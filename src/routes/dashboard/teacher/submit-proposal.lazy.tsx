import { useState, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { z } from "zod";
import { useForm } from "../../../hooks/useForm";
import { useAuth } from "../../../api/auth";
import { PROJECT_TYPE, STUDENT_MAJOR } from "../../../constant/enum";
import { sql } from "../../../api/sql.ts";

export const Route = createLazyFileRoute("/dashboard/teacher/submit-proposal")({
  component: RouteComponent,
});

const FormSchema = z.object({
  SupervisorFirstName: z.string(),
  SupervisorLastName: z.string(),
  coSupervisorFirstName: z.string(),
  coSupervisorLastName: z.string(),
  mastersOption: z.string().trim().min(1),
  type: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  technologies: z.string().trim().min(1),
  materials: z.string().trim().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

function RouteComponent() {
  const user = useAuth((user) => {
    if (user) return;
  });

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      SupervisorFirstName: user?.first_name,
      SupervisorLastName: user?.last_name,
      coSupervisorFirstName: "",
      coSupervisorLastName: "",
      mastersOption: "",
      type: "CLASSICAL",
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


  async function getCoSupervisorId(data: ZodFormSchema) {
    const coSupervisorQuery = `
      SELECT id FROM users 
      WHERE first_name = '${data.coSupervisorFirstName}' 
      AND last_name = '${data.coSupervisorLastName}' 
      LIMIT 1;
    `;
    const coSupervisorResult = await sql("select", coSupervisorQuery);
    const coSupervisorId = coSupervisorResult.data[0]?.id;
    if (!coSupervisorId) {
      alert("Co-Supervisor not found.");
      throw new Error("Co-Supervisor not found.");
    }
    return coSupervisorId;
  }

  async function getProjectId() {
    const lastProjectIdQuery = `SELECT COUNT(*) as count FROM projects;`;
    const lastProjectIdResult = await sql("select", lastProjectIdQuery);
    const count = lastProjectIdResult.data[0]?.count;
    const lastProjectId = count ? parseInt(count, 10) + 1 : 1;
    
    return lastProjectId;
  }
  


  const handleSubmit = async (data: ZodFormSchema) => {
    try {
      const lastProjectId = await getProjectId();
      const coSupervisorId = await getCoSupervisorId(data);
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const query = `
        INSERT INTO projects (title, description, type, status, technologies, material_needs, master_option, created_at)
        VALUES (
          '${data.title.replace(/'/g, "''")}', 
          '${data.description.replace(/'/g, "''")}', 
          '${data.type.replace(/'/g, "''")}', 
          'PROPOSED', 
          '${data.technologies.replace(/'/g, "''")}', 
          '${data.materials.replace(/'/g, "''")}', 
          '${data.mastersOption.toUpperCase().replace(/'/g, "''")}',
          '${formattedDate}'
        )
      `;
      const firstValidator=1;
      const query2= `
        INSERT INTO project_propositions 
        (user_id, project_id, status, validated_by)
        VALUES (
          ${user?.id},
          ${lastProjectId},
          'pending',
          ${firstValidator}
        )
      `;

      const query3=`
        INSERT INTO project_supervisors (project_id, teacher_id, role)
        VALUES (
          ${lastProjectId},
          ${user?.id},
          'SUPERVISOR'
        )
      `;

      const query4=`
        INSERT INTO project_supervisors (project_id, teacher_id, role)
        VALUES (
          ${lastProjectId},
          ${coSupervisorId},
          'CO_SUPERVISOR'
        )
      `;
      

      
      const result = await sql("insert", query);
      const result2= await sql("insert", query2);
      const result3= await sql("insert", query3);
      const result4= await sql("insert", query4);
      console.log("Proposal submitted:", result);
      console.log("Proposal prposition:", result2);
      console.log("Proposal supervisor:", result3);
      console.log("Proposal co-supervisor:", result4);
      alert("Proposal submitted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to submit the proposal. Please try again.");
    }
  };
  

  return (
    <div className="container my-3 component-bg rounded p-3" style={{ width: "90%" }}>
      <h3>Submit PFE Proposal</h3>
      {submissionReminder && (
        <div className="alert alert-warning" role="alert">
          <strong>Reminder:</strong> The deadline for submitting PFE proposals is December 30, 2024.
        </div>
      )}
      <Form 
        onSubmit={form.onSubmit(async (data) => {
          console.log("Form submitted");
        await handleSubmit(data);
      })}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="coSupervisorFirstName">
              <Form.Label>Co-Supervisor First Name</Form.Label>
              <Form.Control
                type="text"
                {...form.register("coSupervisorFirstName", { required: true })}
                placeholder="Co-Supervisor First Name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="coSupervisorLastName">
              <Form.Label>Co-Supervisor Last Name</Form.Label>
              <Form.Control
                type="text"
                {...form.register("coSupervisorLastName", { required: true })}
                placeholder="Co-Supervisor Last Name"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="mastersOption">
              <Form.Label>Master's Option</Form.Label>
              <Form.Select {...form.register("mastersOption", { required: true })}>
                {STUDENT_MAJOR.map((major) => (
                  <option key={major} value={major}>
                    {major.toUpperCase()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select {...form.register("type", { required: true })}>
                {PROJECT_TYPE.map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="title">
              <Form.Label>PFE Title</Form.Label>
              <Form.Control
                type="text"
                {...form.register("title", { required: true })}
                placeholder="Title"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                {...form.register("description", { required: true })}
                placeholder="Description"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="technologies">
              <Form.Label>Technologies</Form.Label>
              <Form.Control
                as="textarea"
                {...form.register("technologies", { required: true })}
                placeholder="Eg: React, Node.js, MongoDB..."
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="materials">
              <Form.Label>Material Needs</Form.Label>
              <Form.Control
                as="textarea"
                {...form.register("materials", { required: true })}
                placeholder="Material Needs"
              />
            </Form.Group>
          </Col>
        </Row>
        <Container className="d-flex justify-content-end">
          <Button type="submit" variant="primary">
            Submit Proposal
          </Button>
        </Container>
      </Form>
    </div>
  );
}
