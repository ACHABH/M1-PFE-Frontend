import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";
import AddModal, { type Ref } from "../../layout/add-modal";
import {
  useGetOne as useGetOneProjects,
} from "../../api/project";
import { sql, useSelectSql } from '../../api/sql.ts';
import { useAuth } from "../../api/auth";


type Props = {
  projectId: number;
  onClose: () => void;
};

const FormSchema = z.object({
  registration_start: z.string().datetime(),
  registration_end: z.string().datetime(),
  presantation_date: z.string().datetime(),
  room: z.number(),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

export default forwardRef<Ref, Props>(({ projectId, onClose }, ref) => {
  const user = useAuth((user) => {
      if (user) return;
    });

  const { data: project } = useGetOneProjects(projectId);
  const { data: rooms } = useSelectSql("SELECT * FROM rooms");

    const RoomQuery = `SELECT * FROM project_presentations WHERE project_id = ${projectId}`;
    const { data: RoomResult } = useSelectSql(RoomQuery);

  const RegistrationQuery = `SELECT * FROM project_registrations WHERE project_id = ${projectId}`;
  const { data: RegistrationResult } = useSelectSql(RegistrationQuery);

  const PresentationQuery = `SELECT * FROM project_presentations WHERE project_id = ${projectId}`;
  const { data: PresentationResult } = useSelectSql(PresentationQuery);

  console.log("Resutl:", RoomResult);
  
  const form = useForm<ZodFormSchema>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
          registration_start: RegistrationResult?.data?.start_date ?? "",
          registration_end: RegistrationResult?.data?.end_date ?? "",
          presantation_date: PresentationResult?.data?.date ?? "",
          room: RoomResult?.data?.room_id ?? "",
      },
      values: {
          registration_start: RegistrationResult?.start_date ?? "",
          registration_end: RegistrationResult?.end_date ?? "",
          presantation_date: PresentationResult?.date ?? "",
          room: RoomResult?.data?.room_id ?? "",
      },
  });

  const handleSubmit = async () => {
    const data= form.getValues();
    const TestQuery= `SELECT * FROM project_registrations WHERE project_id = ${projectId}`;	
    const result = await sql("select",TestQuery);
    if(result?.data?.length>0){
      const query1= `UPDATE project_registrations SET start_date='${new Date(data.registration_start).toISOString().slice(0, 19).replace('T', ' ')}', end_end='${new Date(data.registration_end).toISOString().slice(0, 19).replace('T', ' ')}' WHERE id = ${projectId}`;
      await sql("update", query1);
      const query2= `UPDATE project_presentations SET date='${new Date(data.presantation_date).toISOString().slice(0, 19).replace('T', ' ')}' WHERE id = ${projectId}`;
      await sql("update", query2);
      alert("Dates updated successfully");
    }
    else if(result?.data?.length==0){
      const query3= `INSERT INTO project_registrations (project_id, start_date, end_date) VALUES (${projectId}, '${new Date(data.registration_start).toISOString().slice(0, 19).replace('T', ' ')}', '${new Date(data.registration_end).toISOString().slice(0, 19).replace('T', ' ')}')`;
      await sql("insert", query3);
      const query4= `INSERT INTO project_presentations (room_id ,project_id, date) VALUES (${data.room} ,${projectId}, '${new Date(data.presantation_date).toISOString().slice(0, 19).replace('T', ' ')}')`;
      await sql("insert", query4);
      const query5= `UPDATE projects SET status='approved' WHERE id = ${projectId}`;
      await sql("update", query5);
      const query6= `UPDATE project_propositions SET validated_by=${user?.id}, status='validated' WHERE project_id = ${projectId}`;
      await sql("update", query6);
      alert("Validated successfully");
    }
  };

  return(
      <AddModal ref={ref} title="Set Dates" action={null}>
          <h4>Project: {project?.title}</h4>
          <Form>
              <Form.Group className="mb-3">
                  <Form.Label>Registration Start</Form.Label>
                  <Form.Control
                      type="datetime-local"
                      {...form.register("registration_start")}
                  />
              </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Registration End</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    {...form.register("registration_end")}
                  />
                </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Presantation Date</Form.Label>
                  <Form.Control
                      type="datetime-local"
                      {...form.register("presantation_date")}
                  />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Room</Form.Label>
                <Form.Select {...form.register("room")}>
                  <option value="">Select a room</option>
                  {rooms?.data?.map((room: any) => (
                    <option key={room.id} value={room.id}>
                      {room.room.toLocaleUpperCase()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Container as="div" style={{ display: "flex", gap: 5 }}>
                  <Button variant="success" onClick={async () => await handleSubmit()}>
                      Validate
                  </Button>
                  <Button type="reset" variant="secondary" onClick={onClose}>
                      Cancel
                  </Button>
              </Container>
          </Form>
      </AddModal>
  )

});