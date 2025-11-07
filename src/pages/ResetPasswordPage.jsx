import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import visibleIcon from '../assets/visible.png';
import invisibleIcon from '../assets/invisible.png';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to reset password.');
            }

            setMessage(data.msg);
            setTimeout(() => navigate('/login'), 3000); 

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <main className="form-page-container">
                <div className="form-card">
                    <h1 className="form-title">Error</h1>
                    <p className="form-error">Invalid or missing password reset token.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="form-page-container">
            <div className="form-card">
                <h1 className="form-title">Reset Password</h1>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Enter your new password for: <strong>{email}</strong>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? invisibleIcon : visibleIcon} alt="Toggle password visibility" />
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <img src={showConfirmPassword ? invisibleIcon : visibleIcon} alt="Toggle password visibility" />
                            </button>
                        </div>
                    </div>

                    {error && <p className='form-error'>{error}</p>}
                    {message && <p className='form-success'>{message}</p>}

                    <button type="submit" className="form-button" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Set New Password'}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default ResetPasswordPage;