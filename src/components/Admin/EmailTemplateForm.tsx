import React, { useState } from 'react';

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
    <div className="container my-4 bg-white shadow p-3 rounded" style={{ width: '550px' }}>
      <h4>{template ? 'Edit Template' : 'Add New Template'}</h4>
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
          <label className="form-label">Subject</label>
          <input
            type="text"
            className="form-control"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea
            className="form-control"
            name="body"
            rows="5"
            value={formData.body}
            onChange={handleChange}
            placeholder="You can use placeholders like {name} or {deadline}."
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success me-2">
          Save Template
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EmailTemplateForm;
