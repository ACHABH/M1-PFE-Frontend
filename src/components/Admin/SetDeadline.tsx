import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const SetDeadline = ({ onSetDeadline }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('The start date cannot be after the end date.');
      return;
    }

    onSetDeadline(formData);
    alert('Deadline set successfully!');
    setFormData({ startDate: '', endDate: '' }); // Clear the form
  };

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "400px" }}>
      <h3>Set Project Choosing Deadline</h3>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
        />
      </Form.Group>
      <Button type="submit" className="me-2" variant="primary">
        Set Deadline
      </Button>
      </Form>
    </Container>
  );
};

export default SetDeadline;
