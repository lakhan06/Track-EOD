import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get employeeId from the URL
import { fetchEodsForEmployee, updateEodFeedbackAndStatus } from "../../services/api";
import Modal from "../Model/Modal"; // Reuse existing Modal component
import "./EmployeeEods.css";

const EmployeeEods = () => {
  const { employeeId } = useParams(); // Get employeeId from the route params
  const [eods, setEods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEod, setSelectedEod] = useState(null); // For Modal
  const [status, setStatus] = useState(""); // For updating status
  const [feedback, setFeedback] = useState(""); // For updating feedback
  const [updating, setUpdating] = useState(false); // Updating state

  useEffect(() => {
    const fetchEods = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedEods = await fetchEodsForEmployee(employeeId);
        setEods(fetchedEods);
      } catch (err) {
        console.error("Error fetching EODs:", err.message);
        setError("Failed to fetch EODs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEods();
  }, [employeeId]);

  const openModal = (eod) => {
    setSelectedEod(eod);
    setStatus(eod.status || "Pending");
    setFeedback(eod.feedback || "");
  };

  const closeModal = () => {
    setSelectedEod(null);
    setStatus("");
    setFeedback("");
  };

  const handleUpdateEod = async () => {
    if (!selectedEod) return;

    setUpdating(true);
    try {
      const data = {
        status,
        feedback,
      };

      await updateEodFeedbackAndStatus(selectedEod._id, data);

      // Update the local state to reflect changes
      setEods((prevEods) =>
        prevEods.map((eod) =>
          eod._id === selectedEod._id
            ? { ...eod, status, feedback }
            : eod
        )
      );

      setUpdating(false);
      closeModal();
    } catch (err) {
      console.error("Error updating EOD:", err.message);
      setError("Failed to update EOD. Please try again.");
      setUpdating(false);
    }
  };

  if (loading) return <div className="eods-loading">Loading EODs...</div>;
  if (error) return <div className="eods-error">{error}</div>;

  return (
    <div className="employee-eods-container">
      <h2>Employee's EODs</h2>
      {eods.length > 0 ? (
        <ul className="eods-list">
          {eods.map((eod) => (
            <li key={eod._id} className="eod-item">
              <h3 className="eod-title">{eod.eodTitle}</h3>
              <p>
                <strong>Status:</strong> {eod.status}
              </p>
              <p>
                <strong>Submitted on:</strong>{" "}
                {new Date(eod.submissionDate).toLocaleDateString()}
              </p>
              <button
                className="eod-details-button"
                onClick={() => openModal(eod)}
              >
                More Details
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="eods-empty">No EODs found for this employee.</p>
      )}

      {/* Modal for EOD Details */}
      {selectedEod && (
        <Modal isOpen={!!selectedEod} onClose={closeModal}>
          <div className="eod-modal-content">
            <h2>{selectedEod.eodTitle}</h2>
            <p>
              <strong>Description:</strong> {selectedEod.workDescription}
            </p>
            {selectedEod.mediaFiles.length > 0 && (
              <div className="eod-media">
                <h4>Attached Media:</h4>
                <ul>
                  {selectedEod.mediaFiles.map((url, index) => (
                    <li key={index}>
                    {url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") ? (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                        {/* Video {index+1} */}
                        <video controls>
                          <source src={url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        </a>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Attachment ${index + 1}`} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="eod-update-section">
              <label>
                <strong>Status:</strong>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Approved">Approved</option>
                <option value="NotApproved">Not Approved</option>
              </select>

              <label>
                <strong>Feedback:</strong>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback for this EOD"
              />

              <button
                className="eod-update-button"
                onClick={handleUpdateEod}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update EOD"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeEods;
