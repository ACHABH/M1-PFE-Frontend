import React, { useState } from 'react';

const AddUser = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student', // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData); // Call parent function to handle the addition
    setFormData({ name: '', email: '', role: 'Student' }); // Reset form
  };

  return (
    <div className="container mt-4 bg-white shadow my-3 p-3" style={{borderRadius:"15px"}}>
      <h3>Add User</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
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
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Company">Company</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
