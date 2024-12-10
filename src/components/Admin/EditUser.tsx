import { useState } from 'react';

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
    <div className="container mt-4 component-bg shadow my-3 p-3" style={{borderRadius:"15px", width:"400px"}}>
      <h3>Edit User</h3>
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
        <button type="submit" className="btn btn-success" style={{borderRadius:"15px"}}>Update User</button>
        <button type="reset" className="btn btn-light" style={{borderRadius:"15px", marginLeft:"15px", border: "1.5px solid #ccc"}} onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUser;
