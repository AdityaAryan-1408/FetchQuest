// File: fetch-quest/src/components/ProfileReminderBanner.jsx

import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Link } from 'react-router-dom';

function ProfileReminderBanner() {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(
        sessionStorage.getItem('hidePhoneReminder') !== 'true'
    );

    if (!user || user.phone || !isVisible) {
        return null;
    }

    const handleDismiss = () => {
        sessionStorage.setItem('hidePhoneReminder', 'true');
        setIsVisible(false);
    };

    return (
        <div className="reminder-banner">
            <div className="container reminder-content">
                <p>Please add your phone number to your profile to contact other users.</p>
                <div className="reminder-actions">
                    <Link to="/profile" className="btn btn-primary btn-sm">
                        Go to Profile
                    </Link>
                    <button onClick={handleDismiss} className="dismiss-btn" title="Dismiss">
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileReminderBanner;