import React, { ChangeEvent, FormEvent, useState } from 'react';
import { z } from 'zod';

interface AddDefenseSlotProps {
  onAdd: (formData: FormData) => void;
  onCancel: () => void;
}


const formDataSchema = z.object({
  date: z.string().date().min(1),
  time: z.string().time().min(1),
  room: z.string().min(1),
  participants: z.string().min(1),
});

type FormData = z.infer<typeof formDataSchema>;

const AddDefenseSlot: React.FC<AddDefenseSlotProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    room: '',
    participants: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ date: '', time: '', room: '', participants: '' });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="container my-4 bg-white shadow p-3 rounded" style={{ width: '500px' }}>
      <h3>Add Jurie Slot</h3>
      <form onSubmit={handleSubmit}>
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
        <div className="mb-3">
          <label className="form-label">Room</label>
          <input
            type="text"
            className="form-control"
            name="room"
            value={formData.room}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Participants</label>
          <input
            type="text"
            className="form-control"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            placeholder="e.g., John Doe, Jane Smith"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Add Slot</button>
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

export default AddDefenseSlot;