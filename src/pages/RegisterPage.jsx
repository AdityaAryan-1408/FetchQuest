// File: fetch-quest/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import visibleIcon from '../assets/visible.png';
import invisibleIcon from '../assets/invisible.png';

function RegisterPage() {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to Register, Please try again later.');
            }

            setMessage('Registration Successful! Please check your email for verification link.');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="form-page-container">
            <div className="form-card">
                <h1 className="form-title">Create an Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-input"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="you@college.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
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
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
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
                        {isLoading ? 'Signing Up..' : 'Sign Up'}
                    </button>
                </form>
                <Link to="/login" className="form-link">
                    Already have an account? Log In
                </Link>
            </div>
        </main>
    );
}

export default RegisterPage;