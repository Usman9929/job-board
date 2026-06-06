import React, { useState } from 'react';
import { FiTrash2, FiAlertTriangle, FiX } from 'react-icons/fi';

const DeleteJob = ({ jobId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(jobId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="delete-container">
      {!showConfirm ? (
        <button
          onClick={handleDelete}
          className="danger icon-button"
          title="Delete this job listing"
        >
          <FiTrash2 />
          Delete
        </button>
      ) : (
        <>
          <div className="delete-modal-overlay" onClick={handleCancel}>
            <div className="delete-modal" onClick={e => e.stopPropagation()}>
              <div className="delete-modal-header">
                <div className="delete-modal-icon">
                  <FiAlertTriangle />
                </div>
                <div className="delete-modal-content">
                  <h3>Delete Job Listing?</h3>
                  <p>This action cannot be undone. The job listing and all associated data will be permanently deleted.</p>
                </div>
              </div>
              <div className="delete-modal-actions">
                <button
                  onClick={handleCancel}
                  className="secondary"
                  disabled={isDeleting}
                >
                  <FiX />
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="danger"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite' }} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteJob;