import { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useCreate as useCreateUser } from "../../api/user";
import { readFile } from "../../lib/file-reader";

interface UploadCSV2Props {
  onUpload: (file: File) => void;
  onCancel: () => void;
}

const UploadCSV2: React.FC<UploadCSV2Props> = ({ onUpload, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  // const { mutateAsync: createAdmin } = useCreate();
  const { mutateAsync: createUser } = useCreateUser();

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      const arrayBuffer = await readFile(file);
      const content = arrayBuffer.toString();
      const lines = content.split("\n");

      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(",");
        const first_name = data[0]?.trim() || "";
        const last_name = data[1]?.trim() || "";
        const email = data[2]?.trim() || "";
        const role = data[3]?.trim() || "";
        const password = data[4]?.trim() || "12345678";

        if (!first_name || !last_name || !email || !role) {
          console.error("Missing required fields for user creation", {
            first_name,
            last_name,
            email,
            role,
          });
          continue;
        }

        const userData = {
          first_name,
          last_name,
          email,
          role,
          password,
        };

        try {
          await createUser(userData);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    },
    [createUser]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (file) {
        await handleFileUpload(file);
        onUpload(file);
        setFile(null);
      } else {
        alert("Please select a file before submitting.");
      }
    },
    [file, handleFileUpload, onUpload]
  );

  const handleCancel = useCallback(() => {
    setFile(null);
    onCancel();
  }, [onCancel]);

  return (
    <Container
      className="my-4 component-bg shadow p-3 rounded"
      style={{ width: "400px" }}
    >
      <h3>Upload CSV</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Choose CSV File</Form.Label>
          <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
        </Form.Group>
        <Button type="submit" className="me-2" variant="primary">
          Upload
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default UploadCSV2;
