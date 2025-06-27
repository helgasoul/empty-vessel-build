import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import MenopauseLanding from './pages/MenopauseLanding';
import MenopauseDashboard from './pages/MenopauseDashboard';
import MenopauseDemo from './pages/MenopauseDemo';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

// Keep some existing pages for backward compatibility during transition
import Dashboard from './pages/Dashboard';
import RiskAssessment from './pages/RiskAssessment';
import Recommendations from './pages/Recommendations';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MenopauseLanding />
      },
      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: '/menopause-dashboard',
        element: (
          <ProtectedRoute>
            <MenopauseDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/menopause-demo',
        element: <MenopauseDemo />
      },
      // Legacy routes for transition period
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/risk-assessment',
        element: (
          <ProtectedRoute>
            <RiskAssessment />
          </ProtectedRoute>
        )
      },
      {
        path: '/recommendations',
        element: (
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
