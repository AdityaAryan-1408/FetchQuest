import React from 'react';

// Footer
function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <p>
                    &copy; 2025 FetchQuest. A project by
                    {/* ADD A SPACE HERE --> */} <a
                        href="https://github.com/AdityaAryan-1408"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        Aditya Aryan
                    </a>.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
