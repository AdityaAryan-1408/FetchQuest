import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <section className="hero">
            <div className="container hero-content">
                <h1 className="hero-title">Campus errands, done by students, for students.</h1>
                <p className="hero-subtitle">
                    Need something from the shop but don't want to go? Post a request and have a fellow student deliver it to your door.
                </p>
                <div className="hero-actions">
                    <Link to="/dashboard" className="btn btn-primary">Post a Request</Link>
                    <Link to="/requests" className="btn btn-secondary">See Live Requests</Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;

