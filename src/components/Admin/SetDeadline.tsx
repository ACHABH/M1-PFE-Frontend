import { useState } from 'react';

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
    <div className="container mt-4">
      <h3>Set Project Choosing Deadline</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Set Deadline
        </button>
        
      </form>
    </div>
  );
};

export default SetDeadline;
