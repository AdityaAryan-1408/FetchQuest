import React, { useState, useEffect } from 'react';
import RequestCard from '../Components/RequestCard';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LiveRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpenRequests = async () => {
            try {
                const response = await fetch('/api/requests');
                if (!response.ok) {
                    throw new Error('Failed to fetch data from the server');
                }
                const data = await response.json();
                setRequests(data.requests);
            } catch (fetchError) {
                setError(fetchError.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOpenRequests();
    }, []);

    const handleAcceptQuest = async (questId) => {
        if (!isAuthenticated || !token) {
            setError("You must be logged in to accept a quest.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`/api/requests/${questId}/accept`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Failed to accept quest.');
            }

            setRequests(prevRequests =>
                prevRequests.filter(request => request._id !== questId)
            );

        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <main className='container'><p className='page-title'>Loading Quests...</p></main>;
    }

    if (error && isLoading) {
        return <main className='container'><p className='page-title'>Error: {error}</p></main>;
    }

    return (
        <main className='container'>
            <h1 className='page-title'>Live Requests</h1>

            {error && !isLoading && <p className='form-error' style={{ marginBottom: '1rem' }}>{error}</p>}

            <div className='requests-grid'>
                {requests.length > 0 ? (
                    requests.map(request => (
                        <RequestCard
                            key={request._id}
                            request={request}
                            context="live"
                            onAccept={handleAcceptQuest}
                        />
                    ))
                ) : (
                    <p>No open requests found.</p>
                )}
            </div>
        </main>
    )
}

export default LiveRequestsPage;