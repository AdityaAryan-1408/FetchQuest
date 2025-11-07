import React from 'react';
import defaultAvatar from '../assets/default-user.png';
import { useAuth } from '../Context/AuthContext';

// Shows the Request available.
function RequestCard({ request, context, onDelete, onComplete, onAccept, onRate, onOpenDetails }) {
    const { _id: questId, itemsList, deliveryLocation, estimatedCost, tip, status, requesterId } = request;
    const total = tip + estimatedCost;

    const { user, isAuthenticated } = useAuth();

    let displayUser = null;
    let headerText = '';
    let isRunnerInfo = false;

    if (context === 'live' || context === 'my-runs') {
        displayUser = request.requesterId;
    } else if (context === 'my-quests') {
        displayUser = request.runnerId;
        isRunnerInfo = true;
    }

    if (isRunnerInfo) {
        if (status === 'open') {
            headerText = 'Waiting for a Runner...';
        } else if (displayUser) {
            headerText = `Runner: ${displayUser.name}`;
        } else if (status === 'accepted') {
            headerText = 'Quest is in Progress';
        } else {
            headerText = 'Quest Completed';
        }
    } else {
        headerText = displayUser?.name || 'Requester Info Missing';
    }

    const userRating = displayUser?.averageRating || 0;

    // Allows to perform various actions for a Req
    const renderActionButtons = () => {
        switch (context) {
            case 'my-quests':
                if (status === 'open') {
                    return (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onDelete(questId)}
                        >
                            Delete
                        </button>
                    );
                }
                if (status === 'accepted') {
                    return (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onComplete(request)}
                        >
                            Mark Complete
                        </button>
                    );
                }
                return <span className="status-badge completed">Completed</span>;

            case 'my-runs':
                if (status === 'accepted') {
                    return <span className="status-badge in-progress">In Progress</span>;
                }
                if (status === 'completed') {
                    return (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onRate(request)}
                        >
                            Rate Requester
                        </button>
                    );
                }
                return null;

            default:
                if (!isAuthenticated) {
                    return null;
                }
                if (user?._id === requesterId?._id) {
                    return null;
                }
                return (
                    <button
                        className="request-accept-btn"
                        onClick={() => onAccept(questId)}
                    >
                        Accept
                    </button>
                );
        }
    };

    return (
        <div className="request-card">
            <div className="request-card-header">
                {displayUser && (
                    <img
                        src={displayUser.profilePictureUrl || defaultAvatar}
                        alt={`${displayUser.name}'s avatar`}
                        className="user-avatar"
                    />
                )}

                <div className="user-info-container">
                    <span className="user-name">{headerText}</span>

                    {context === 'live' && (
                        userRating > 0 ? (
                            <span className="user-rating-badge star">
                                ★ {userRating.toFixed(1)}
                            </span>
                        ) : (
                            <span className="user-rating-badge new">
                                New User
                            </span>
                        )
                    )}
                </div>
            </div>

            <div className="request-card-body">
                <p className="request-items"><strong>Wants:</strong> {itemsList}</p>
                <p className="request-location"><strong>To:</strong> {deliveryLocation}</p>
            </div>

            <div className="request-card-footer">
                <div className="cost-details">
                    <div className="cost-item">
                        <span>Items:</span>
                        <span>₹{estimatedCost}</span>
                    </div>
                    <div className="cost-item">
                        <span>Tip:</span>
                        <span>₹{tip}</span>
                    </div>
                    <div className="cost-item total-cost">
                        <span>Total:</span>
                        <span>₹{total}</span>
                    </div>
                </div>
                <div className="card-actions-container">
                    {(context === 'my-quests' || context === 'my-runs') &&
                        (status === 'accepted' || status === 'completed') && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => onOpenDetails(request)}
                            >
                                Details
                            </button>
                        )}

                    {renderActionButtons()}
                </div>
            </div>
        </div>
    );
}

export default RequestCard;