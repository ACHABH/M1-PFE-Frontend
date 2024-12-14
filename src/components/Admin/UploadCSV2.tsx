import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

interface UploadCSV2Props {
  onUpload: (file: File) => void;
  onCancel: () => void;
}

const UploadCSV2: React.FC<UploadCSV2Props> = ({ onUpload, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file); // Call parent function to handle the file upload
      setFile(null); // Reset file input
    } else {
      alert("Please select a file before submitting.");
    }
  };

  const handleCancel = () => {
    setFile(null); // Reset the file input
    onCancel(); // Call the onCancel prop to hide the modal
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
