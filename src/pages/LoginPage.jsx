import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import visibleIcon from '../assets/visible.png';
import invisibleIcon from '../assets/invisible.png';

function LoginPage() {
    const { login } = useAuth();

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! status: ${response.status}`);
            }

            login(data.user, data.token);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="form-page-container">
            <div className="form-card">
                <h1 className="form-title">Welcome Back!</h1>
                <form onSubmit={handleSubmit}>
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
                    {error && <p className='form-error'>{error}</p>}
                    <button type="submit" className="form-button" disabled={isLoading}>
                        {isLoading ? 'Logging in..' : 'Log in'}
                    </button>
                </form>
                <Link to="/register" className="form-link">
                    Don't have an account? Sign Up
                </Link>
            </div>
        </main>
    );
}

export default LoginPage;