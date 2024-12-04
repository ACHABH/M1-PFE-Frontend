import React, { ChangeEvent, FormEvent, useState } from 'react';
import { z } from 'zod';

interface AddDefenseSlotProps {
  onAdd: (formData: FormData) => void;
  onCancel: () => void;
}


const formDataSchema = z.object({
  startDate: z.string().date().min(1),
  endDate: z.string().date().min(1),
  startTime: z.string().time().min(1),
  endTime: z.string().time().min(1),
  rooms: z.string().min(1),
});

type FormData = z.infer<typeof formDataSchema>;

const AddDefenseSlot: React.FC<AddDefenseSlotProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    rooms: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="container my-4 bg-white shadow p-3 rounded" style={{ width: '500px' }}>
      <h3>Add Jurie Slot</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Day</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Day</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Starting Time</label>
          <input
            type="time"
            className="form-control"
            name="time"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ending Time</label>
          <input
            type="time"
            className="form-control"
            name="time"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rooms (Comma-separated)</label>
          <input
            type="text"
            className="form-control"
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            placeholder="e.g., N101, N102, N103"
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