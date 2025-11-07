
import React from 'react';

// Quest Delete Modal
function DeleteQuestModal({ onConfirm, onCancel }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2 className="modal-title">Delete Quest?</h2>
                <p className="modal-text">
                    Are you sure you want to delete this quest? This action cannot be undone.
                </p>
                <div className="modal-actions">
                    <button
                        onClick={onCancel}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-danger"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteQuestModal;