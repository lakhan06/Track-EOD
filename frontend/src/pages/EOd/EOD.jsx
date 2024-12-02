import React, { useState } from "react";
import axios from "axios";
import { submitEod } from "../../services/api"; // Your EOD API service
import "./EOD.css";

const AddEod = () => {
  const [form, setForm] = useState({
    eodTitle: "",
    workDescription: "",
    mediaFiles: [], // URLs of uploaded files
  });
  const [mediaFiles, setMediaFiles] = useState([]); // Raw file inputs
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        // Upload API (adjust endpoint to your backend upload API)
        const { data } = await axios.post("http://localhost:8000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrls.push(data.url); // Store returned URL
      }
      setForm((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...uploadedUrls],
      }));
      setSuccess("Files uploaded successfully!");
    } catch (err) {
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      const response = await submitEod({
        eodTitle: form.eodTitle,
        workDescription: form.workDescription,
        mediaFiles: form.mediaFiles, // URLs of uploaded files
      });

      setSuccess("EOD submitted successfully!");
      setForm({ eodTitle: "", workDescription: "", mediaFiles: [] });
      setMediaFiles([]);
    } catch (err) {
      console.error("EOD submission error:", err.response);
      setError(err?.message || "EOD submission failed. Please try again.");
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setMediaFiles(files);
    handleFileUpload(files);
  };

  return (
    <div className="add-eod-container">
      <h2>Submit EOD</h2>
      <form className="add-eod-form" onSubmit={handleSubmit}>
        {/* EOD Title */}
        <div className="form-group">
          <label>EOD Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter EOD title"
            value={form.eodTitle}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, eodTitle: e.target.value }))
            }
            required
          />
        </div>

        {/* Work Description */}
        <div className="form-group">
          <label>Work Description</label>
          <textarea
            className="form-textarea"
            placeholder="Describe your work..."
            value={form.workDescription}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, workDescription: e.target.value }))
            }
            required
          />
        </div>

        {/* Media Files Upload */}
        <div className="form-group">
          <label>Attach Media Files</label>
          <input
            type="file"
            multiple
            className="form-input"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Uploaded Media Files */}
        <div className="uploaded-files">
          <h4>Uploaded Files:</h4>
          {form.mediaFiles.length > 0 ? (
            <ul>
              {form.mediaFiles.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </div>

        {/* Success/Error Messages */}
        {uploading && <p className="info-message">Uploading files...</p>}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={uploading}>
          Submit EOD
        </button>
      </form>
    </div>
  );
};

export default AddEod;
