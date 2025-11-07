
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function VerifyEmailPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError("No verification token found.");
            setIsLoading(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Verification failed.');
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    if (isLoading) {
        return (
            <main className="form-page-container">
                <div className="form-card">
                    <h1 className="form-title">Verifying...</h1>
                    <p style={{ textAlign: 'center' }}>
                        Please wait while we verify your account.
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="form-page-container">
                <div className="form-card">
                    <h1 className="form-title">Verification Failed</h1>
                    <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>
                    <p style={{ textAlign: 'center' }}>
                        This link may be invalid or expired. Please try registering again.
                    </p>
                </div>
            </main>
        );
    }

    // Success!
    return (
        <main className="form-page-container">
            <div className="form-card">
                <h1 className="form-title">Success!</h1>
                <p className="form-success" style={{ marginBottom: '1rem' }}>
                    Your email has been successfully verified.
                </p>
                <Link to="/login" className="form-button" style={{ textDecoration: 'none' }}>
                    Proceed to Log In
                </Link>
            </div>
        </main>
    );
}

export default VerifyEmailPage;