import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

const EditProposalForm = ({ proposal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...proposal });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, status: "Pending Approval" });
  };

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "400px" }}>
        <h4>Edit Proposal: {proposal.title}</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
          <Button type="submit" className="me-2" variant="success">
            Save Changes
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Form>
      </Container>
  );
};

export default EditProposalForm;
