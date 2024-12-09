import { useState } from "react";

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
    <div className="container mt-4">
      <h4>Edit Proposal: {proposal.title}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Feedback</label>
          <textarea
            className="form-control"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            disabled
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success me-2">
          Save Changes
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProposalForm;
