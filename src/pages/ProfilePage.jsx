// File: fetch-quest/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/default-user.png';
import DeleteConfirmationModal from '../Components/DeleteConfirmationModal';
import { useAuth } from '../Context/AuthContext';

function ProfilePage() {
    const { user, token, logout, setUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || defaultAvatar);
    const [imageFile, setImageFile] = useState(null);

    const [stats, setStats] = useState({
        averageRating: user?.averageRating || 0,
        requestsMade: user?.requestsMade || 0,
        runsCompleted: user?.runsCompleted || 0,
    });

    const [phone, setPhone] = useState(user?.phone || '');
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const [phoneError, setPhoneError] = useState(null);
    const [phoneMessage, setPhoneMessage] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        return () => {
            setError(null);
            setMessage(null);
            setPhoneError(null);
            setPhoneMessage(null);
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setProfilePictureUrl(URL.createObjectURL(file));
        }
    };

    // This is the handler for Name and Profile Picture
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);
        setMessage('');

        let latestUserData = user;

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadResponse = await fetch('/api/users/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
                const uploadData = await uploadResponse.json();
                if (!uploadResponse.ok) {
                    throw new Error(uploadData.msg || 'Image upload failed.');
                }
                latestUserData = uploadData.user;
                setImageFile(null);
            }

            if (name !== latestUserData.name) {
                const updateResponse = await fetch('/api/users/update', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name }),
                });

                const updateData = await updateResponse.json();
                if (!updateResponse.ok) {
                    throw new Error(updateData.msg || 'Failed to update profile name.');
                }
                latestUserData = updateData.user;
            }

            setUser(latestUserData);
            setMessage('Profile saved successfully!');

        } catch (err) {
            setError(err.message);
            setProfilePictureUrl(user?.profilePictureUrl || defaultAvatar);
        } finally {
            setIsUpdating(false);
        }
    };

    // Handler for Phone Number
    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setIsUpdatingPhone(true);
        setPhoneError(null);
        setPhoneMessage('');

        const phoneRegex = /^\d{10}$/;
        if (phone.trim() !== '' && !phoneRegex.test(phone)) {
            setPhoneError("Please enter a valid 10-digit phone number.");
            setIsUpdatingPhone(false);
            return;
        }
        try {
            const response = await fetch('/api/users/update-phone', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to update phone number.');
            }

            setUser(data.user);
            setPhoneMessage(data.msg);

        } catch (err) {
            setPhoneError(err.message);
        } finally {
            setIsUpdatingPhone(false);
        }
    };

    const handleDeleteConfirm = async (password) => {
        setIsDeleting(true);
        setError(null);
        try {
            const response = await fetch('/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Deletion failed.');
            }
            logout();
        } catch (err) {
            setError(err.message);
            setIsModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {isModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setIsModalOpen(false)}
                    isDeleting={isDeleting}
                />
            )}
            <main className='form-page-container'>
                <div className='form-card'>
                    <h1 className='form-title'>My Profile</h1>

                    <div className="profile-picture-section">
                        <img src={profilePictureUrl} alt="Profile" className="profile-picture-preview" />
                        <input
                            type="file"
                            id="profilePictureInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg"
                        />
                        <label htmlFor="profilePictureInput" className="btn btn-secondary">
                            Change Picture
                        </label>
                    </div>

                    <div className="stats-section">
                        <div className="stat-item">
                            <span className="stat-value">{stats.averageRating.toFixed(1)} ★</span>
                            <span className="stat-label">Rating</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.requestsMade}</span>
                            <span className="stat-label">Quests Made</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.runsCompleted}</span>
                            <span className="stat-label">Runs Done</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="name" className='form-label'>Name</label>
                            <input
                                type='text'
                                id='name'
                                className='form-input'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="email" className='form-label'>Email</label>
                            <input
                                type='email'
                                id='email'
                                className='form-input'
                                value={email}
                                readOnly
                                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
                            />
                        </div>

                        {error && !isModalOpen && <p className="form-error">{error}</p>}
                        {message && <p className="form-success">{message} </p>}

                        <button type="submit" className="form-button" disabled={isUpdating} style={{ marginBottom: '1.5rem' }}>
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>

                    <hr className="form-divider" style={{ marginBottom: '1.5rem' }} />
                    <form onSubmit={handlePhoneSubmit}>
                        <div className='form-group'>
                            <label htmlFor="phone" className='form-label'>Phone Number</label>
                            <input
                                type='text'
                                id='phone'
                                className='form-input'
                                placeholder=''
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength="10"
                                pattern="[0-9]{10}"
                                title="Please enter exactly 10 digits"
                            />
                        </div>
                        {phoneError && <p className="form-error">{phoneError}</p>}
                        {phoneMessage && <p className="form-success">{phoneMessage}</p>}
                        <button type="submit" className="form-button" disabled={isUpdatingPhone}>
                            {isUpdatingPhone ? 'Saving Phone...' : 'Save Phone'}
                        </button>
                    </form>

                    <div className="danger-zone">
                        <h2 className="danger-zone-title">Danger Zone</h2>
                        <p>Permanently delete your account and all associated data.</p>
                        <button onClick={() => setIsModalOpen(true)} className="btn btn-danger">
                            Delete Account
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ProfilePage;