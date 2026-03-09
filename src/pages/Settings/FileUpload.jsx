import { useState } from "react";
import "./settings.css";

export default function FileUpload({ label, accept, onFileSelect }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (onFileSelect) onFileSelect(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  const isImage = file && file.type.startsWith("image/");

  return (
    <div className="file-upload-container">
      <label>{label}</label>
      <input type="file" accept={accept || "*/*"} onChange={handleChange} />

      {file && (
        <div className="file-upload-preview">
          {isImage && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="file-preview-img"
            />
          )}
          <p>
            Selected file: <strong>{file.name}</strong>{" "}
            <button type="button" onClick={clearFile} className="btn-clear">
              Clear
            </button>
          </p>
        </div>
      )}
    </div>
  );
}