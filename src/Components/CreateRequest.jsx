import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

// Form takes input about what to order
function CreateRequestForm() {
    const { token, closeCreateModal, triggerNewQuest } = useAuth();

    const [itemsList, setItemsList] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [tip, setTip] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!itemsList || !estimatedCost || !tip || !deliveryLocation) {
            setError('Please fill out all fields.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemsList,
                    estimatedCost: Number(estimatedCost),
                    tip: Number(tip),
                    deliveryLocation
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to create quest.');
            }

            setItemsList('');
            setEstimatedCost('');
            setTip('');
            setDeliveryLocation('');
            triggerNewQuest();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-backdrop') {
            closeCreateModal();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content form-card" style={{ maxWidth: '500px' }}>
                <h2 className="form-title" style={{ marginBottom: '1.5rem' }}>Create a New Request</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="items" className="form-label">What items do you need?</label>
                        <textarea
                            id="items"
                            className="form-input"
                            rows="3"
                            placeholder="e.g., 2x Maggi, 1x Coke Zero"
                            value={itemsList}
                            onChange={(e) => setItemsList(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="deliveryLocation" className="form-label">Delivery Location</label>
                        <input
                            type="text"
                            id="deliveryLocation"
                            className="form-input"
                            placeholder="e.g., Hostel K, Block E"
                            value={deliveryLocation}
                            onChange={(e) => setDeliveryLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="estimatedCost" className="form-label">Estimated Item Cost (₹)</label>
                        <input
                            type="number"
                            id="estimatedCost"
                            className="form-input"
                            placeholder="e.g., 50"
                            value={estimatedCost}
                            onChange={(e) => setEstimatedCost(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tip" className="form-label">Delivery Tip (₹)</label>
                        <input
                            type="number"
                            id="tip"
                            className="form-input"
                            placeholder="e.g., 15"
                            value={tip}
                            onChange={(e) => setTip(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className='form-error'>{error}</p>}
                    <div className="modal-actions" style={{ marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={closeCreateModal}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Posting...' : 'Post Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRequestForm;