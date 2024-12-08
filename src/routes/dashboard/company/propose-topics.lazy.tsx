import { useForm, Controller } from "react-hook-form";
import { Form, Button, Col, Row } from "react-bootstrap";
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
    <div className="container mt-4">
      <div className="mb-5">
        <h2>Propose a New Topic</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Company Name */}
        <Form.Group as={Row} className="mb-4" controlId="companyName">
          <Form.Label column sm={2}>
            Company Name
          </Form.Label>
          <Col sm={10}>
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
          </Col>
        </Form.Group>

        {/* Project Specialty */}
        <Form.Group as={Row} className="mb-4" controlId="specialty">
          <Form.Label column sm={2}>
            Specialty
          </Form.Label>
          <Col sm={10}>
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
          </Col>
        </Form.Group>

        {/* Topic Title */}
        <Form.Group as={Row} className="mb-4" controlId="title">
          <Form.Label column sm={2}>
            Title
          </Form.Label>
          <Col sm={10}>
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
          </Col>
        </Form.Group>

        {/* Topic Description */}
        <Form.Group as={Row} className="mb-4" controlId="description">
          <Form.Label column sm={2}>
            Description
          </Form.Label>
          <Col sm={10}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  as="textarea"
                  rows={4}
                  placeholder="Enter topic description"
                  isInvalid={!!errors.description}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        {/* Used Technologies */}
        <Form.Group as={Row} className="mb-4" controlId="technologies">
          <Form.Label column sm={2}>
            Used Technologies
          </Form.Label>
          <Col sm={10}>
            <Controller
              name="technologies"
              control={control}
              defaultValue=""
              rules={{ required: "Technologies are required" }}
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
          </Col>
        </Form.Group>

        {/* Submit Button */}
        <div className="text-center">
          <Button variant="primary" type="submit" size="lg">
            Submit Proposal
          </Button>
        </div>
      </Form>
    </div>
  );
}
