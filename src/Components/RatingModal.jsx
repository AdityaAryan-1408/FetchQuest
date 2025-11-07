
import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

function Star({ filled, onClick }) {
    return (
        <span className="star" onClick={onClick}>
            {filled ? '★' : '☆'}
        </span>
    );
}

// Rating Modal, allows the user to Rate the Runner/Requester. Rating is reflected in Profile.
function RatingModal({ quest, userToRate, onClose }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const handleSubmitRating = async () => {
        if (rating === 0) {
            setError("Please select a rating from 1 to 5 stars.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/requests/${quest._id}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || "Failed to submit rating.");
            }

            onClose(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 className="modal-title">Rate Your Experience</h2>
                <p className="modal-text">
                    How was your experience with <strong>{userToRate.name}</strong> for the quest: "{quest.itemsList}"?
                </p>

                <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Star
                            key={index}
                            filled={index <= (hoverRating || rating)}
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHoverRating(index)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>

                {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}

                <div className="modal-actions">
                    <button
                        onClick={() => onClose(false)}
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={handleSubmitRating}
                        className="btn btn-primary"
                        disabled={isLoading || rating === 0}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RatingModal;