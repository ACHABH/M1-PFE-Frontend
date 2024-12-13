import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';


const EditUser = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData); // Call parent function to handle the update
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container className="mt-4 component-bg shadow my-3 p-3 rounded" style={{ width: "400px" }}>
      <h3>Edit User</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Company">Company</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" className="me-2" variant="success" style={{ borderRadius: "15px" }}>
          Update User
        </Button>
        <Button type="button" className="btn-light" style={{ borderRadius: "15px", marginLeft: "15px", border: "1.5px solid #ccc" }} onClick={handleCancel}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditUser;
