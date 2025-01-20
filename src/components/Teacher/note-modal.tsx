import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import AddModal, { type Ref } from "../../layout/add-modal";
import { useGetOne as useGetOneProjects } from "../../api/project";
import { sql } from "../../api/sql";  // Import the sql function

type Props = {
  projectId: number;
  onClose: () => void;
};

const FormSchema = z.object({
  note: z.number().gte(0).lte(20),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default forwardRef<Ref, Props>(({ projectId, onClose }, ref) => {
  const { data: project } = useGetOneProjects(projectId);

  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      note: project?.project_note?.note ?? 0,
    },
    values: {
      note: project?.project_note?.note ?? 0,
    },
  });

  const handleNoteSubmit = async () => {
    console.log("Handle submit called with data:", form.getValues());
    const data= form.getValues();
    try {
      // SQL query to insert the note for all students associated with the project
      const query = `
        INSERT OR REPLACE INTO project_notes (student_id, project_id, note)
        SELECT student_id, ${projectId}, ${data.note}
        FROM project_students
        WHERE project_id = ${projectId};
      `;
      
      // Execute the SQL query
      const response= await sql("insert", query);

      form.reset();
      onClose(); // Close the modal after successful submission
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  return (
    <AddModal ref={ref} title="Set Note" action={null}>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Project Note</Form.Label>
          <Form.Control
            type="number"
            {...form.register("note", { required: true })}
          />
        </Form.Group>
        <Container as="div" style={{ display: "flex", gap: 5 }}>
          <Button variant="success" onClick={async () => await handleNoteSubmit()}>
            Confirm
          </Button>
          <Button type="reset" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Container>
      </Form>
    </AddModal>
  );
});
