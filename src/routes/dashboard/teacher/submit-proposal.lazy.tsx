import { useState, useEffect} from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { z } from "zod";
import {
  useCreate as useCreateProject,
} from "../../../api/project";
import { useForm } from '../../../hooks/useForm';
import { useAuth } from '../../../api/auth';
import { PROJECT_TYPE, STUDENT_MAJOR } from "../../../constant/enum";


export const Route = createLazyFileRoute('/dashboard/teacher/submit-proposal')({
  component: RouteComponent,
})

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
  
  const { mutateAsync: createProject } = useCreateProject();

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      SupervisorFirstName: user?.first_name,
      SupervisorLastName: user?.last_name,
      coSupervisorFirstName: '',
      coSupervisorLastName: '',
      mastersOption: '',
      type: 'Classic',
      title: '',
      description: '',
      technologies: '',
      materials: '',
    },
    values: {
      SupervisorFirstName: user?.first_name || '',
      SupervisorLastName: user?.last_name || '',
      coSupervisorFirstName: '',
      coSupervisorLastName: '',
      mastersOption: '',
      type: 'Classic',
      title: '',
      description: '',
      technologies: '',
      materials: '',
    },
  });

  const [submissionReminder, setSubmissionReminder] = useState(false)

  // Simulated Reminder Logic
  useEffect(() => {
    const deadline = new Date('2024-12-30') //exp date
    const now = new Date()
    if (now < deadline) {
      setSubmissionReminder(true)
    }
  }, [])

  return (
    <div className="container my-3 component-bg rounded p-3" style={{width:"90%"}}>
      <h3>Submit PFE Proposal</h3>
      {submissionReminder && (
        <div className="alert alert-warning" role="alert">
          <strong>Reminder:</strong> The deadline for submitting PFE proposals is December 30, 2024.
        </div>
      )}
      <Form
        onSubmit={form.onSubmit(async (data) => {
          await createProject(data);
          form.reset();
        })}
      >
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="coSupervisorFirstName">
            <Form.Label>Co-Supervisor First Name</Form.Label>
            <Form.Control
              type="text"
              {...form.register("coSupervisorFirstName", { required: true })}
              placeholder='Co-Supervisor First Name'
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="coSupervisorLastName">
            <Form.Label>Co-Supervisor Last Name</Form.Label>
            <Form.Control
              type="text"
              {...form.register("coSupervisorLastName", { required: true })}
              placeholder='Co-Supervisor Last Name'
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="mastersOption">
            <Form.Label>Master's Option</Form.Label>
            <Form.Select
              {...form.register("mastersOption", { required: true })}
            >
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
              placeholder='description'
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
  )
}
