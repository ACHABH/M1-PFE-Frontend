import React, { useState, ChangeEvent, FormEvent } from 'react';

interface AddPFEProposalProps {
  onAdd: (formData: FormData) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  type: string;
  description: string;
}

const AddPFEProposal: React.FC<AddPFEProposalProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'Classic',
    description: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ title: '', type: 'Classic', description: ''});
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="container my-4 bg-white shadow p-3 rounded" style={{ width: '400px' }}>
      <h3>Add PFE Proposal</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Classic">Classic</option>
            <option value="Innovative">Innovative</option>
          </select>
        </div>
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
        <button type="submit" className="btn btn-primary me-2">Add Proposal</button>
        <button
          type="reset"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddPFEProposal;
