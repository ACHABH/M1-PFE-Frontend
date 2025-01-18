import { useForm, Controller } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/company/propose-topics")({
  component: Component,
});

interface FormData {
  companyName: string;
  specialty: string;
  title: string;
  description: string;
  technologies: string;
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
    reset(); // Reset the form after submission
  };

  return (
    <Container
      className="my-3 component-bg rounded p-3"
      style={{ width: "90%" }}
    >
      <h3>Submit a New Topic Proposal</h3>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="companyName">
              <Form.Label>Company Name</Form.Label>
              <Controller
                name="companyName"
                control={control}
                defaultValue=""
                rules={{ required: "Company name is required" }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter the company name"
                    isInvalid={!!errors.companyName}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.companyName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
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
                    placeholder="Enter the project specialty"
                    isInvalid={!!errors.specialty}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.specialty?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="title"  className="mb-3">
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
            <Form.Group controlId="technologies">
              <Form.Label>Technologies</Form.Label>
              <Controller
                name="technologies"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    as="textarea"
                    rows={3}
                    placeholder="Enter technologies to be used"
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
                    rows={6}
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

export default Component;
