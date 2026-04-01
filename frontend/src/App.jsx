import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import JobListPage from './pages/jobs/JobListPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import JobFormPage from './pages/jobs/JobFormPage';
import MyApplicationsPage from './pages/applications/MyApplicationsPage';
import ManageApplicationsPage from './pages/applications/ManageApplicationsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import InterviewsPage from './pages/interviews/InterviewsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import UsersPage from './pages/admin/UsersPage';

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/jobs/new" element={<ProtectedRoute roles={['RECRUITER']}><JobFormPage /></ProtectedRoute>} />
        <Route path="/jobs/edit/:id" element={<ProtectedRoute roles={['RECRUITER', 'ADMIN']}><JobFormPage /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute roles={['CANDIDATE']}><MyApplicationsPage /></ProtectedRoute>} />
        <Route path="/manage-applications" element={<ProtectedRoute roles={['RECRUITER']}><ManageApplicationsPage /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute roles={['CANDIDATE']}><DocumentsPage /></ProtectedRoute>} />
        <Route path="/my-interviews" element={<ProtectedRoute roles={['CANDIDATE']}><InterviewsPage /></ProtectedRoute>} />
        <Route path="/interviews" element={<ProtectedRoute roles={['RECRUITER']}><InterviewsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><UsersPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner" style={{ height: '100vh' }}><div className="spinner" /></div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppRoutes />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
