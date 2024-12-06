import { createLazyFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';

export const Route = createLazyFileRoute('/owner/owner')({
  component: RouteComponent,
})

function RouteComponent() {
    const [admins, setAdmins] = useState([
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      ]);
    
      const [formData, setFormData] = useState({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    
      const [editing, setEditing] = useState(false);
      const [showForm, setShowForm] = useState(false);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          alert('Please fill out all fields.');
          return;
        }
    
        if (editing) {
          setAdmins(
            admins.map((admin) =>
              admin.id === formData.id ? { ...admin, ...formData, password: undefined } : admin
            )
          );
          alert('Admin updated successfully!');
        } else {
          setAdmins([...admins, { id: Date.now(), ...formData }]);
          alert('Admin added successfully!');
        }
    
        setFormData({ id: null, firstName: '', lastName: '', email: '', password: '' });
        setEditing(false);
        setShowForm(false);
      };
    
      const handleEdit = (admin) => {
        setFormData({ ...admin, password: '' });
        setEditing(true);
        setShowForm(true); // Ensure the form is displayed
      };
    
      const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
          setAdmins(admins.filter((admin) => admin.id !== id));
          alert('Admin removed successfully!');
        }
      };
    
      const handleCancel = () => {
        setFormData({ id: null, firstName: '', lastName: '', email: '', password: '' });
        setEditing(false);
        setShowForm(false); // Hide the form on cancel
      };
    
      return (
        <div className="container mt-4" style={{minHeight:"100vh"}}>
          <div className="d-flex" style={{ justifyContent: 'space-between' }}>
            <div>
              <h3>Owner Dashboard</h3>
              <p>This page allows the owner to manage administrators for the platform.</p>
            </div>
            <button
              className="btn btn-primary mb-3"
              onClick={() => {
                setShowForm(true);
                setEditing(false); // Ensure form is reset for adding a new admin
              }}
            >
              Add New Admin
            </button>
          </div>
          <h4>Admins</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.firstName}</td>
                  <td>{admin.lastName}</td>
                  <td>{admin.email}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(admin)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(admin.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showForm && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
              style={{ zIndex: 1050 }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded shadow"
                style={{ width: '400px' }}
              >
                <h4>{editing ? 'Edit Admin' : 'Add Admin'}</h4>
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editing} // Password is required only for new admins
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      );
    };