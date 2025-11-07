import React, { useState } from 'react';

// Account Delete Modal
function DeleteConfirmationModal({ onConfirm, onCancel, isDeleting }) {
    const [password, setPassword] = useState('');

    const handleConfirm = () => {
        onConfirm(password);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2 className="modal-title">Are you sure?</h2>
                <p className="modal-text">
                    This action is permanent and cannot be undone. All of your data, including your requests and ratings, will be permanently deleted.
                </p>
                <p className="modal-text">
                    To confirm, please enter your password.
                </p>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={onCancel} className="btn btn-secondary" disabled={isDeleting}>
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className="btn btn-danger" disabled={!password || isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete My Account'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;