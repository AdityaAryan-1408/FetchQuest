// File: fetch-quest/src/App.jsx

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAuth } from './Context/AuthContext';
import ProfileReminderBanner from './Components/ProfileReminderBanner';
import CreateRequestForm from './Components/CreateRequest';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LiveRequestsPage from './pages/LiveRequestsPage';
import ProfilePage from './pages/ProfilePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChatPage from './pages/ChatPage';

function App() {
  const { isCreateModalOpen } = useAuth();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {isCreateModalOpen && <CreateRequestForm />}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <ProfileReminderBanner />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/requests" element={<LiveRequestsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/chat/:questId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;