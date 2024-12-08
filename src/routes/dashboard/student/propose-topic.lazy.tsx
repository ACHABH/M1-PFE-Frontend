import { useForm, Controller } from "react-hook-form";
import { Form, Button, Col, Row } from "react-bootstrap";
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
    // Reset the form after submission
    reset();
  };

  return (
    <div className="container mt-4">
      <div className="mb-5">
        <h2>Propose a New Topic</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Student Information */}
        <Form.Group as={Row} className="mb-4" controlId="studentFirstName">
          <Form.Label column sm={2}>
            Student First Name
          </Form.Label>
          <Col sm={10}>
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
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-4" controlId="studentLastName">
          <Form.Label column sm={2}>
            Student Last Name
          </Form.Label>
          <Col sm={10}>
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
          </Col>
        </Form.Group>

        {/* Binome Information */}
        <Form.Group as={Row} className="mb-4" controlId="binomeFirstName">
          <Form.Label column sm={2}>
            Binome First Name
          </Form.Label>
          <Col sm={10}>
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
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-4" controlId="binomeLastName">
          <Form.Label column sm={2}>
            Binome Last Name
          </Form.Label>
          <Col sm={10}>
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
          </Col>
        </Form.Group>

        {/* Specialty */}
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
                  placeholder="Enter your specialty"
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
              render={({ field }) => (
                <Form.Control
                  {...field}
                  placeholder="Enter technologies to be used"
                />
              )}
            />
          </Col>
        </Form.Group>

        {/* Materials */}
        <Form.Group as={Row} className="mb-4" controlId="materials">
          <Form.Label column sm={2}>
            Required Materials
          </Form.Label>
          <Col sm={10}>
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
