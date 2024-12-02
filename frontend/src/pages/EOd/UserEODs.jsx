import React, { useState, useEffect } from "react";
import { fetchEodsForUser } from "../../services/api"; // Import the API function
import Modal from "../Model/Modal"; // Import your modal component
import "./UserEods.css";

const UserEods = () => {
  const [eods, setEods] = useState([]);
  const [filteredEods, setFilteredEods] = useState([]); // Filtered EODs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEod, setSelectedEod] = useState(null);

  // Filter state
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchEods = async () => {
      try {
        setError(null);
        setLoading(true);
        const fetchedEods = await fetchEodsForUser();
        setEods(fetchedEods);
        setFilteredEods(fetchedEods); // Initially display all EODs
      } catch (err) {
        console.error("Error fetching EODs:", err.message);
        setError("Failed to fetch EODs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEods();
  }, []);

  useEffect(() => {
    const filtered = eods.filter((eod) => {
      const submissionDate = new Date(eod.submissionDate);
      const matchesMonth = selectedMonth
        ? submissionDate.getMonth() + 1 === parseInt(selectedMonth)
        : true;
      const matchesYear = selectedYear
        ? submissionDate.getFullYear() === parseInt(selectedYear)
        : true;
      return matchesMonth && matchesYear;
    });
    setFilteredEods(filtered);
  }, [selectedMonth, selectedYear, eods]);

  const handleMoreDetails = (eod) => {
    setSelectedEod(eod);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEod(null);
    setIsModalOpen(false);
  };

  if (loading) return <div className="eods-loading">Loading EODs...</div>;
  if (error) return <div className="eods-error">{error}</div>;

  return (
    <div className="eods-container">
      <h2 className="eods-title">My EODs</h2>

      {/* Filter Options */}
      <div className="filter-container">
        <div className="filter-row">
          <label className="filter-label">
            Select Month:
            <select
              className="filter-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-label">
            Select Year:
            <select
              className="filter-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {Array.from(
                new Set(eods.map((eod) => new Date(eod.submissionDate).getFullYear()))
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* EOD List */}
      {filteredEods.length > 0 ? (
        <ul className="eods-list">
          {filteredEods.map((eod) => (
            <li key={eod._id} className="eod-item">
              <h3 className="eod-title">{eod.eodTitle}</h3>
              <p className="eod-date">
                <strong>Submitted on:</strong>{" "}
                {new Date(eod.submissionDate).toLocaleDateString()}
              </p>
              <p className={`eod-status ${eod.status.toLowerCase()}`}>
                Status: <span className="status">{eod.status}</span>
              </p>
              <button
                className="more-details-btn"
                onClick={() => handleMoreDetails(eod)}
              >
                More Details
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="eods-empty">No EODs found for the selected filters.</p>
      )}

      {/* Modal for EOD details */}
      {isModalOpen && selectedEod && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="eod-modal-details">
            <h2>{selectedEod.eodTitle}</h2>
            <p>
              <strong>Work Description:</strong> {selectedEod.workDescription}
            </p>
            <p>
              <strong>Submitted on:</strong>{" "}
              {new Date(selectedEod.submissionDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedEod.status}
            </p>
            {selectedEod.feedback && (
              <p className="eod-feedback">
                <strong>Feedback from Company:</strong> {selectedEod.feedback}
              </p>
            )}
            {selectedEod.mediaFiles.length > 0 && (
              <div className="eod-media">
                <h4>Attached Media:</h4>
                <ul>
                  {selectedEod.mediaFiles.map((url, index) => (
                    <li key={index}>
                      {url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") ? (
                        <video controls>
                          <source src={url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
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
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserEods;
