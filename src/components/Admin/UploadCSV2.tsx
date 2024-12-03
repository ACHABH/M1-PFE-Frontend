import React, { useState, ChangeEvent, FormEvent } from 'react';

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
    <div className="container mt-4 mb-4 bg-white shadow p-3 rounded" style={{ width: '400px' }}>
      <h3>Upload CSV</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Choose CSV File</label>
          <input
            type="file"
            className="form-control"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Upload</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UploadCSV2;
