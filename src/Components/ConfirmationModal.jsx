import React from 'react';

// Popup to confirm before deleting quest or Account.
function ConfirmationModal({
    title,
    message,
    confirmText,
    onConfirm,
    onCancel,
    isLoading = false
}) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2 className="modal-title">{title}</h2>
                <p className="modal-text">{message}</p>
                <div className="modal-actions">
                    <button
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-danger"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;