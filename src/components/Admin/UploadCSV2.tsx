import { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { FaUpload, FaTimes } from "react-icons/fa";
import { useCreate as useCreateUser } from "../../api/user";
import { readFile } from "../../lib/file-reader";

interface UploadCSV2Props {
  show: boolean;
  onUpload: (file: File) => void;
  onCancel: () => void;
}

const UploadCSV2: React.FC<UploadCSV2Props> = ({ show, onUpload, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createUser } = useCreateUser();

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv") {
        setError("Please select a valid CSV file");
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setError(null);
      const arrayBuffer = await readFile(file);
      const content = arrayBuffer.toString();
      const lines = content.split("\n");
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(",");
        const first_name = data[0]?.trim() || "";
        const last_name = data[1]?.trim() || "";
        const email = data[2]?.trim() || "";
        const role = data[3]?.trim() || "";
        const password = data[4]?.trim() || "12345678";

        if (!first_name || !last_name || !email || !role) {
          errors.push(`Row ${i}: Missing required fields`);
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
          errors.push(`Row ${i}: ${(error as Error).message}`);
        }
      }

      if (errors.length > 0) {
        setError(`Upload completed with errors:\n${errors.join("\n")}`);
      }
    },
    [createUser]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!file) {
        setError("Please select a file before submitting.");
        return;
      }

      setIsUploading(true);
      try {
        await handleFileUpload(file);
        onUpload(file);
        setFile(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsUploading(false);
      }
    },
    [file, handleFileUpload, onUpload]
  );

  const handleClose = useCallback(() => {
    setFile(null);
    setError(null);
    onCancel();
  }, [onCancel]);

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Upload Users CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Choose CSV File</Form.Label>
            <div className="custom-file-upload">
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {file && (
                <div className="selected-file">
                  <span className="file-name">{file.name}</span>
                  <Button
                    variant="link"
                    className="p-0 ms-2"
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                  >
                    <FaTimes className="text-danger" />
                  </Button>
                </div>
              )}
            </div>
            <Form.Text className="text-muted">
              CSV format: first_name, last_name, email, role, password (optional)
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isUploading}
          className="d-flex align-items-center gap-2"
        >
          <FaTimes /> Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!file || isUploading}
          className="d-flex align-items-center gap-2"
        >
          <FaUpload /> {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </Modal.Footer>

      <style>{`
        .custom-file-upload {
          position: relative;
          margin-bottom: 0.5rem;
        }

        .selected-file {
          display: flex;
          align-items: center;
          margin-top: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: #f8f9fa;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .file-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .modal-content {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          border: none;
        }

        .modal-header {
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }

        .modal-footer {
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
        }
      `}</style>
    </Modal>
  );
};

export default UploadCSV2;
