import React, { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

interface AddEmailScheduleProps {
  onAdd: (formData: FormData) => void;
  onCancel: () => void;
}


const formDataSchema = z.object({
  receiver: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().date().min(1),
  time: z.string().time().min(1),
  sendWhen: z.string().min(1),
});

type FormData = z.infer<typeof formDataSchema>;

const AddEmailSchedule: React.FC<AddEmailScheduleProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    receiver: '',
    title: '',
    description: '',
    date: '',
    time: '',
    sendWhen: 'Right Now',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ receiver: '', title: '', description: '', date: '', time: '', sendWhen: 'Right Now' });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="container my-4 bg-white shadow p-3 rounded" style={{ width: '500px' }}>
      <h3>Add Email Schedule</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Receiver</label>
          <select
            className="form-select"
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            required
          >
            {['All', 'Students', 'Teachers', 'Companies'].map((receiver) => (
              <option key={receiver} value={receiver}>
                {receiver}
              </option>
            ))}
          </select>
        </div>
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
          <label className="form-label">Send When</label>
          <select
            className="form-select"
            name="sendWhen"
            value={formData.sendWhen}
            onChange={handleChange}
            required
          >
            {['Right Now', 'Specified'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {formData.sendWhen === 'Specified' && (
          <div className='d-flex justify-content-between'>
            <div className="mb-3" style={{ width: '47%' }}>
              <label className="form-label ">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3" style={{ width: '47%' }}>
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
          </div>
        )}
        <button type="submit" className="btn btn-primary me-2">Add Schedule</button>
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

export default AddEmailSchedule;
