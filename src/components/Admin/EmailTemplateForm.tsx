import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const EmailTemplateForm = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    template || { title: '', subject: '', body: '' }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "550px" }}>
      <h4>{template ? 'Edit Template' : 'Add New Template'}</h4>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Subject</Form.Label>
        <Form.Control
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Body</Form.Label>
        <Form.Control
        as="textarea"
        name="body"
        rows={5}
        value={formData.body}
        onChange={handleChange}
        placeholder="You can use placeholders like {name} or {deadline}."
        required
        />
      </Form.Group>
      <Button type="submit" className="me-2" variant="success">
        Save Template
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      </Form>
    </Container>
  );
};

export default EmailTemplateForm;
