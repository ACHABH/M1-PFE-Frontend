import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useForm } from "../../hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from 'zod';

const ScheduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  // date: z.string().optional(),
  // time: z.string().optional(),
});

type ZodFormSchema = z.infer<typeof ScheduleSchema>;

interface EditEmailScheduleProps {
  schedule: ZodFormSchema;
  onUpdate: (schedule: ZodFormSchema) => void;
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

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      title: formData.title,
      description: formData.description,
    },
  });

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: '500px' }}>
      <h3>Edit Email Schedule</h3>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
        {...form.register("title", { required: true })}
        type='text'
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
        as="textarea"
        {...form.register("description", { required: true })}
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        />
      </Form.Group>
      {/* <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Time</Form.Label>
        <Form.Control
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
        />
      </Form.Group> */}
      <Button type="submit" className="me-2" variant="success">Update Schedule</Button>
      <Button type="reset" variant="secondary" onClick={handleCancel}>Cancel</Button>
      </Form>
    </Container>
  );
};

export default EditEmailSchedule;
