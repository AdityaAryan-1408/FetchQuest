import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

function HowItWorks() {
    const [elementRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

    return (
        <section
            ref={elementRef}
            className={`how-it-works fade-in-section ${isVisible ? 'is-visible' : ''}`}
        >
            <div className="container">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-icon">📝</div>
                        <h3>1. Post a Request</h3>
                        <p>List the items you need and set a tip you're willing to pay for the delivery.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">🏃‍♂️</div>
                        <h3>2. A Runner Accepts</h3>
                        <p>A student who is heading to the shop accepts your request and buys your items.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">🤝</div>
                        <h3>3. Get Your Stuff</h3>
                        <p>Your items are delivered to your room. Pay the runner for the items and their tip.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;

