import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useCreate } from "../../api/admin";
import { useCreate as createUserAPI } from "../../api/user"; 

interface UploadCSV2Props {
  onUpload: (file: File) => void;
  onCancel: () => void;
}

const UploadCSV2: React.FC<UploadCSV2Props> = ({ onUpload, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: createAdmin } = useCreate();
  const { mutateAsync: createUser } = createUserAPI();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (file) {
      await handleFileUpload(file); 
      onUpload(file);
      setFile(null);
    } else {
      alert("Please select a file before submitting.");
    }
  };

  const handleCancel = () => {
    setFile(null);
    onCancel();
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n");

      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(",");
        const first_name = data[0]?.trim() || '';
        const last_name = data[1]?.trim() || '';
        const email = data[2]?.trim() || '';
        const role = data[3]?.trim() || '';
        const password = data[4]?.trim() || '12345678'; 

        if (!first_name || !last_name || !email || !role) {
          console.error("Missing required fields for user creation", { first_name, last_name, email, role });
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
    };
    reader.readAsText(file);
  };

  return (
    <Container className="my-4 component-bg shadow p-3 rounded" style={{ width: "400px" }}>
      <h3>Upload CSV</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Choose CSV File</Form.Label>
          <Form.Control
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
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
