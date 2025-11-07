import React, { useState, useEffect } from 'react';
import RequestCard from '../Components/RequestCard';
import { useAuth } from '../Context/AuthContext';
import RatingModal from '../Components/RatingModal';
import QuestDetailsModal from '../Components/QuestDetailsModal';
import ConfirmationModal from '../Components/ConfirmationModal';


// Shows details for posted requests and accepted runs, Allowing to perform Various actions on the said requests.
function DashboardPage() {
    const [myRequests, setMyRequests] = useState([]);
    const [myRuns, setMyRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questToRate, setQuestToRate] = useState(null);
    const [questForDetails, setQuestForDetails] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        title: '',
        message: '',
        confirmText: '',
        onConfirm: () => { },
    });
    const [targetQuestId, setTargetQuestId] = useState(null);

    const { token, user, newQuestTrigger } = useAuth();

    // Fetches data from Backend api
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) {
                setError("You must be logged in to view this page.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const [requestsResponse, runsResponse] = await Promise.all([
                    fetch('/api/requests/my-requests', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('/api/requests/my-runs', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                if (!requestsResponse.ok || !runsResponse.ok) {
                    throw new Error('Failed to fetch dashboard data. Please try again later.');
                }
                const requestsData = await requestsResponse.json();
                const runsData = await runsResponse.json();
                setMyRequests(requestsData.requests);
                setMyRuns(runsData.requests);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token, newQuestTrigger]);

    // Function to delete quest
    const handleDeleteQuest = (questId) => {
        setTargetQuestId(questId);
        setModalProps({
            title: 'Delete Quest?',
            message: 'Are you sure you want to delete this quest? This cannot be undone.',
            confirmText: 'Delete',
            onConfirm: () => confirmDeleteQuest(questId),
        });
        setIsConfirmModalOpen(true);
    };
    // Deletes the Quest
    const confirmDeleteQuest = async (questId) => {
        try {
            const response = await fetch(`/api/requests/${questId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Failed to delete quest.');
            }
            setMyRequests(prevRequests =>
                prevRequests.filter(request => request._id !== questId)
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setIsConfirmModalOpen(false);
            setTargetQuestId(null);
        }
    };

    // Function to complete quest
    const handleCompleteQuest = async (questToComplete) => {
        try {
            const response = await fetch(`/api/requests/${questToComplete._id}/complete`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Failed to complete quest.');
            }
            const { request: apiUpdatedQuest } = await response.json();
            const updatedQuest = { ...questToComplete, status: apiUpdatedQuest.status };
            setMyRequests(prevRequests =>
                prevRequests.map(req =>
                    req._id === updatedQuest._id ? updatedQuest : req
                )
            );
            setQuestToRate(updatedQuest);
        } catch (err) {
            setError(err.message);
        }
    };
    const handleOpenRatingModal = (quest) => {
        setQuestToRate(quest);
    };
    const handleCloseRatingModal = () => {
        setQuestToRate(null);
    };

    const handleOpenDetailsModal = (quest) => {
        setQuestForDetails(quest);
    };

    const handleCloseDetailsModal = () => {
        setQuestForDetails(null);
    };

    // Function to cancel quest
    const handleCancelQuest = (questId) => {
        setTargetQuestId(questId);
        setModalProps({
            title: 'Cancel Quest?',
            message: 'Are you sure you want to cancel this quest? This will return it to the live feed.',
            confirmText: 'Cancel Quest',
            onConfirm: () => confirmCancelQuest(questId),
        });
        setIsConfirmModalOpen(true);
        handleCloseDetailsModal();
    };

    // Cancels the Quest
    const confirmCancelQuest = async (questId) => {
        try {
            const response = await fetch(`/api/requests/${questId}/cancel`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Failed to cancel quest.');
            }
            setMyRequests(prev => prev.map(q =>
                q._id === questId ? { ...q, status: 'open', runnerId: null } : q
            ));
            setMyRuns(prev => prev.filter(q => q._id !== questId));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsConfirmModalOpen(false);
            setTargetQuestId(null);
        }
    };


    return (
        <main className="dashboard-container">
            <h1 className="page-title">Your Dashboard</h1>

            {error && !loading && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}

            <div className="dashboard-grid">
                <div className="dashboard-column">
                    <h2 className="dashboard-section-title">My Quests ({myRequests.length})</h2>
                    {loading ? (
                        <p>Loading your quests...</p>
                    ) : (
                        <div className="dashboard-requests-list">
                            {myRequests.length > 0 ? (
                                myRequests.map(request => (
                                    <RequestCard
                                        key={request._id}
                                        request={request}
                                        context="my-quests"
                                        onDelete={handleDeleteQuest}
                                        onComplete={handleCompleteQuest}
                                        onOpenDetails={handleOpenDetailsModal}
                                    />
                                ))
                            ) : (
                                <p>You haven't created any quests yet.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="dashboard-column">
                    <h2 className="dashboard-section-title">My Runs ({myRuns.length})</h2>
                    {loading ? (
                        <p>Loading your runs...</p>
                    ) : (
                        <div className="dashboard-requests-list">
                            {myRuns.length > 0 ? (
                                myRuns.map(run => (
                                    <RequestCard
                                        key={run._id}
                                        request={run}
                                        context="my-runs"
                                        onRate={handleOpenRatingModal}
                                        onOpenDetails={handleOpenDetailsModal}
                                    />
                                ))
                            ) : (
                                <p>You haven't accepted any runs yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isConfirmModalOpen && (
                <ConfirmationModal
                    title={modalProps.title}
                    message={modalProps.message}
                    confirmText={modalProps.confirmText}
                    onConfirm={modalProps.onConfirm}
                    onCancel={() => setIsConfirmModalOpen(false)}
                />
            )}

            {questToRate && (
                <RatingModal
                    quest={questToRate}
                    userToRate={
                        questToRate.requesterId._id === user._id
                            ? questToRate.runnerId
                            : questToRate.requesterId
                    }
                    onClose={handleCloseRatingModal}
                />
            )}

            {questForDetails && (
                <QuestDetailsModal
                    quest={questForDetails}
                    onClose={handleCloseDetailsModal}
                    onCancelQuest={handleCancelQuest}
                />
            )}
        </main>
    );
}

export default DashboardPage;