import { Form, Button } from 'react-bootstrap';
import AddModal, { type Ref } from "../../layout/add-modal";
import { forwardRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "../../hooks/useForm";


const FormSchema = z.object({
  id: z.number().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
});

type ZodFormSchema = z.infer<typeof FormSchema>;

type Props = {
  template: ZodFormSchema ;
  onClose: () => void;
};

// I wanted to pass just the id of the template but I couldn't get the data of template from API

export default forwardRef<Ref, Props>(({ template , onClose }, ref) => {
  // const [formData, setFormData] = useState(
  //   template || { title: '', subject: '', body: '' }
  // );

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSave(formData);
  // };
  
  const form = useForm<ZodFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: template?.id ?? "",
      subject: template?.subject ?? "",
      content: template?.content ?? "",
    },
    values: {
      id: template?.id ?? "",
      subject: template?.subject ?? "",
      content: template?.content ?? "",
    },
  });

  return (
    // <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "550px" }}>
      // <h4>{template ? 'Edit Template' : 'Add New Template'}</h4>
    <AddModal ref={ref} title={template ? "Update Template" : "Add New Template"} action={null}>
      <Form onSubmit={() => console.log(template)}>
      {/* <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
        type="text"

        // name="title"
        // value={formData.title}
        // onChange={handleChange}
        // required
        />
      </Form.Group> */}
      <Form.Group className="mb-3">
        <Form.Label>Subject</Form.Label>
        <Form.Control
          {...form.register("subject", { required: true })}
          type="text"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          {...form.register("content", { required: true })}
          placeholder="You can use placeholders like {name} or {deadline}."
        // required
        />
      </Form.Group>
      <Button type="submit" className="me-2" variant="success">
        {template ? "Update" : "Add"}
      </Button>
      <Button type="reset" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      </Form>
    </AddModal>
    // </Container>
  );
});

// export default EmailTemplateForm;
