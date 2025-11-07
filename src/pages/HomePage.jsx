import React from 'react';
import Hero from '../Components/Hero';
import HowItWorks from '../Components/HowItWorks';
import { Link } from 'react-router-dom';

function HomePage({ isAuthenticated }) {

    const loggedInHero = (
        <section className="hero">
            <div className="container">
                <h1>Welcome Back!</h1>
                <p>Ready to make a new request or complete a run?</p>
                <div className="hero-actions">
                    <Link to="/requests" className="btn btn-primary">View Live Quests</Link>
                    <Link to="/dashboard" className="btn btn-secondary">My Dashboard</Link>
                </div>
            </div>
        </section>
    );
    return (
        <>
            {isAuthenticated ? loggedInHero : <Hero />}
            <HowItWorks />
        </>
    );
}

export default HomePage;