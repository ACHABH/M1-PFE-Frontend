import { useState } from 'react';

interface Schedule {
  title: string;
  description: string;
  date: string;
  time: string;
}

interface EditEmailScheduleProps {
  schedule: Schedule;
  onUpdate: (schedule: Schedule) => void;
  onCancel: () => void;
}

const EditEmailSchedule = ({ schedule, onUpdate, onCancel }: EditEmailScheduleProps) => {
  const [formData, setFormData] = useState(schedule);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="container my-4 component-bg shadow p-3 rounded" style={{ width: '500px' }}>
      <h3>Edit Email Schedule</h3>
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
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Time</label>
          <input
            type="time"
            className="form-control"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Update Schedule</button>
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

export default EditEmailSchedule;
