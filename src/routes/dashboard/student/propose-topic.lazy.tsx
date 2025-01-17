import { useForm, Controller } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/student/propose-topic")({
  component: Component,
});

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  binomeFirstName?: string;
  binomeLastName?: string;
  specialty: string;
  title: string;
  description: string;
  technologies: string;
  materials: string;
}

function Component() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Proposed Topic Data:", data);
    reset();
  };

  return (
    <Container
      className="my-3 component-bg rounded p-3"
      style={{ width: "90%" }}
    >
      <h3>Submit Your Topic Proposal</h3>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="studentFirstName">
              <Form.Label>Student First Name</Form.Label>
              <Controller
                name="studentFirstName"
                control={control}
                defaultValue=""
                rules={{ required: "First name is required" }}
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
                rules={{ required: "Last name is required" }}
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
                rules={{ required: "Specialty is required" }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter your specialty"
                    isInvalid={!!errors.specialty}
                  />
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
                rules={{ required: "Title is required" }}
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
            <Form.Group controlId="technologies" className="mb-3">
              <Form.Label>Technologies</Form.Label>
              <Controller
                name="technologies"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter technologies to be used"
                  />
                )}
              />
            </Form.Group>
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
                  />
                )}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{ required: "Description is required" }}
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
