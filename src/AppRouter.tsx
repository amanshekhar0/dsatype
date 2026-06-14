import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AlgorithmProvider } from './context/AlgorithmContext';
import { TypingProvider } from './context/TypingContext';
import { PageBackground } from './components/layout/PageBackground';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { FundamentalsPage } from './pages/FundamentalsPage';

import { TopicPage } from './pages/TopicPage';

export function AppRouter() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AlgorithmProvider>
            <TypingProvider>
              <PageBackground />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/fundamentals" element={<FundamentalsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/:topicId" element={<TopicPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </TypingProvider>
          </AlgorithmProvider>
        </SettingsProvider>
      </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
