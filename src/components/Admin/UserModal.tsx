import { Modal, Button, Form } from 'react-bootstrap';
import { USER_ROLE, type UserRole } from '../../constant/enum';
import { useState } from 'react';
import {
  useDelete as useDeleteUser,
  useGetAll as useGetAllUsers,
} from '../../api/user';

interface UserModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  }) => void;
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
  isEdit?: boolean;
}

export default function UserModal({ 
  show, 
  onHide, 
  onSubmit, 
  initialData,
  isEdit = false 
}: UserModalProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    role: initialData?.role || USER_ROLE.STUDENT,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit User' : 'Add New User'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              required
            >
              {Object.values(USER_ROLE).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEdit ? 'Save Changes' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
