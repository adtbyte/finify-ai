import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GeneratePage from './pages/GeneratePage';
import PortfolioPage from './pages/PortfolioPage';
import LandingPage from './pages/LandingPage';
import LiveMarket from './pages/LiveMarketPage'; // New
import Vault from './pages/VaultPage'; // New
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './context/AuthContext';

/* Redirects logged-in users away from the landing page */
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-primary)',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            position: 'relative',
            overflowX: 'hidden'
          }}>
            <Navbar />

            <main style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              backgroundColor: 'var(--bg-main)',
              transition: 'background-color 0.3s ease',
            }}>
              <Routes>
                {/* ── Root Logic ── */}
                <Route path="/" element={<RootRedirect />} />

                {/* ── Public Access Nodes ── */}
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/live"     element={<LiveMarket />} />

                {/* ── Protected Strategy Nodes ── */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><DashboardPage /></ProtectedRoute>
                }/>
                <Route path="/generate" element={
                  <ProtectedRoute><GeneratePage /></ProtectedRoute>
                }/>
                <Route path="/vault" element={
                  <ProtectedRoute><Vault /></ProtectedRoute>
                }/>
                <Route path="/portfolio/:id" element={
                  <ProtectedRoute><PortfolioPage /></ProtectedRoute>
                }/>

                {/* ── Terminal Fallback ── */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Terminal Aesthetic Layer */}
              <div className="scanline" aria-hidden="true" />
            </main>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;