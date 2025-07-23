import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

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
      {showConfirm ? (
        <div className="delete-confirmation">
          <span>Are you sure?</span>
          <button 
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="danger"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <FaSpinner className="spinner" /> Deleting...
              </>
            ) : (
              <>
                <FiTrash2 /> Confirm
              </>
            )}
          </button>
        </div>
      ) : (
        <button 
          onClick={handleDelete}
          className="danger icon-button"
        >
          <FiTrash2 /> Delete
        </button>
      )}
    </div>
  );
};

export default DeleteJob;