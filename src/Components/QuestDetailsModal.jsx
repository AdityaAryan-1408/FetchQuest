import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import defaultAvatar from '../assets/default-user.png';

// Shows Details about the Quest to both Requester and Runner.
// Allows the user to Cancel, Chat and getContact Info for the Runner/Requester.
function QuestDetailsModal({ quest, onClose, onCancelQuest }) {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const [phoneLoading, setPhoneLoading] = useState(false);

    const isRequester = user._id === quest.requesterId._id;
    const otherUser = isRequester ? quest.runnerId : quest.requesterId;

    if (!otherUser) {
        return (
            <div className="modal-backdrop" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2 className="modal-title">Quest Details</h2>
                    <p className="modal-text">Waiting for a Runner to accept this quest.</p>
                    <div className="modal-actions">
                        <button onClick={onClose} className="btn btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        );
    }

    const userRating = otherUser.averageRating || 0;
    const userRuns = otherUser.runsCompleted || 0;
    const userName = otherUser.name || 'User';

    const handleGoToChat = () => {
        navigate(`/chat/${quest._id}`);
    };

    const handleShowContact = async () => {
        setPhoneLoading(true);
        setPhoneError(null);
        setPhoneNumber(null);

        try {
            const response = await fetch(`/api/requests/${quest._id}/contact`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to get contact info.');
            }
            setPhoneNumber(data.phone);
        } catch (err) {
            setPhoneError(err.message);
        } finally {
            setPhoneLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">
                    {isRequester ? 'Your Runner' : 'Your Requester'}
                </h2>

                <div className="profile-picture-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <img
                        src={otherUser.profilePictureUrl || defaultAvatar}
                        alt={userName}
                        className="profile-picture-preview"
                        style={{ width: '100px', height: '100px' }}
                    />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{userName}</h3>
                    {userRating > 0 ? (
                        <span className="user-rating-badge star">
                            ★ {userRating.toFixed(1)}
                        </span>
                    ) : (
                        <span className="user-rating-badge new">
                            New User
                        </span>
                    )}
                </div>

                <div className="stats-section" style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                    <div className="stat-item">
                        <span className="stat-value">{userRating.toFixed(1)} ★</span>
                        <span className="stat-label">Rating</span>
                    </div>
                    {isRequester && (
                        <div className="stat-item">
                            <span className="stat-value">{userRuns}</span>
                            <span className="stat-label">Runs Done</span>
                        </div>
                    )}
                </div>

                {quest.status === 'accepted' && (
                    <div className="contact-info-section">
                        {!phoneNumber && !phoneError && !phoneLoading && (
                            <button onClick={handleShowContact} className="btn btn-secondary" style={{ width: '100%' }}>
                                Show Contact Info
                            </button>
                        )}
                        {phoneLoading && <p style={{ textAlign: 'center' }}>Loading...</p>}
                        {phoneError && <p className="form-error" style={{ textAlign: 'center' }}>{phoneError}</p>}
                        {phoneNumber && (
                            <div className="contact-info-display">
                                <span>Phone:</span>
                                <strong>{phoneNumber}</strong>
                            </div>
                        )}
                    </div>
                )}


                <div className="modal-actions" style={{ marginTop: '1.5rem', justifyContent: 'space-between' }}>
                    {quest.status === 'accepted' ? (
                        <button
                            onClick={() => onCancelQuest(quest._id)}
                            className="btn btn-danger"
                        >
                            Cancel Quest
                        </button>
                    ) : (
                        <div />
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={onClose} className="btn btn-secondary">
                            Close
                        </button>
                        {quest.status === 'accepted' && (
                            <button onClick={handleGoToChat} className="btn btn-primary">
                                Chat
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestDetailsModal;