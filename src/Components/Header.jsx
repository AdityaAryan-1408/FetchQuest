
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Icon Imports
import sunIcon from '../assets/sun.png';
import moonIcon from '../assets/moon.png';
import fetchIcon from '../assets/fetch.png';
import defaultUser from '../assets/default-user.png';
import profileIcon from '../assets/profile.png';
import dashboardIcon from '../assets/dashboard.png';
import homeIcon from '../assets/home.png';
import logoutIcon from '../assets/power.png';
import runnerIcon from '../assets/runner.png'

function Header({ theme, toggleTheme }) {
    const { isAuthenticated, user, logout, openCreateModal } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    // Links when User is not logged In
    const loggedOutLinks = (
        <>
            <Link to='/login' className='nav-link'>Log In</Link>
            <Link to='/register' className='nav-link primary'>Sign Up</Link>
        </>
    );

    // Links when User is logged In
    const loggedInMenu = (
        <div className='profile-menu-container' ref={menuRef}>
            <button className='profile-btn' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <img
                    src={user?.profilePictureUrl || defaultUser}
                    alt="Profile"
                    className='user-avatar'
                />
            </button>
            {isMenuOpen && (
                <div className='dropdown-menu'>
                    <Link to='/profile' className='dropdown-item' onClick={() => setIsMenuOpen(false)}>
                        <img src={profileIcon} alt="" className="dropdown-icon" />
                        <span>Profile</span>
                    </Link>
                    <Link to='/dashboard' className='dropdown-item' onClick={() => setIsMenuOpen(false)}>
                        <img src={dashboardIcon} alt="" className="dropdown-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link to='/requests' className='dropdown-item' onClick={() => setIsMenuOpen(false)}>
                        <img src={runnerIcon} alt="" className="dropdown-icon" />
                        <span>Live Requests</span>
                    </Link>
                    <Link to='/' className='dropdown-item' onClick={() => setIsMenuOpen(false)}>
                        <img src={homeIcon} alt="" className="dropdown-icon" />
                        <span>Home</span>
                    </Link>
                    <div className='dropdown-divider'></div>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className='dropdown-item dropdown-item-logout'>
                        <img src={logoutIcon} alt="" className="dropdown-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <header className="main-header">
            <div className="container">
                <Link to="/" className="logo">
                    <img src={fetchIcon} alt="FetchQuest logo" className="logo-icon" />
                    <span>FetchQuest</span>
                </Link>
                <nav className="main-nav">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
                        {theme === 'light'
                            ? <img src={sunIcon} alt="Light mode icon" style={{ width: '24px', height: '24px' }} />
                            : <img src={moonIcon} alt="Dark mode icon" style={{ width: '24px', height: '24px' }} />}
                    </button>

                    {isAuthenticated ? (
                        <>
                            <button className="nav-link primary" onClick={openCreateModal}>
                                Create Quest
                            </button>
                            {loggedInMenu}
                        </>
                    ) : (
                        loggedOutLinks
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;