import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { Briefcase, LayoutDashboard, FileText, Users, Calendar, FolderOpen, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout, isAdmin, isRecruiter, isCandidate } = useAuth();
  const { t } = useLang();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">R</div>
        <h2>RecruitPro</h2>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">{t('sidebar.main')}</div>
        <Link to="/dashboard" className={isActive('/dashboard')}>
          <LayoutDashboard size={20} className="link-icon" />
          {t('sidebar.dashboard')}
        </Link>
        <Link to="/jobs" className={isActive('/jobs')}>
          <Briefcase size={20} className="link-icon" />
          {t('sidebar.jobOffers')}
        </Link>
      </div>

      {isCandidate && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">{t('sidebar.candidate')}</div>
          <Link to="/my-applications" className={isActive('/my-applications')}>
            <FileText size={20} className="link-icon" />
            {t('sidebar.myApplications')}
          </Link>
          <Link to="/my-interviews" className={isActive('/my-interviews')}>
            <Calendar size={20} className="link-icon" />
            {t('sidebar.myInterviews')}
          </Link>
          <Link to="/documents" className={isActive('/documents')}>
            <FolderOpen size={20} className="link-icon" />
            {t('sidebar.myDocuments')}
          </Link>
        </div>
      )}

      {isRecruiter && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">{t('sidebar.recruiter')}</div>
          <Link to="/manage-applications" className={isActive('/manage-applications')}>
            <FileText size={20} className="link-icon" />
            {t('sidebar.applications')}
          </Link>
          <Link to="/interviews" className={isActive('/interviews')}>
            <Calendar size={20} className="link-icon" />
            {t('sidebar.interviews')}
          </Link>
        </div>
      )}

      {isAdmin && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">{t('sidebar.admin')}</div>
          <Link to="/users" className={isActive('/users')}>
            <Users size={20} className="link-icon" />
            {t('sidebar.users')}
          </Link>
        </div>
      )}

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.firstName} {user?.lastName}</div>
          <div className="user-role">{user?.role?.toLowerCase()}</div>
        </div>
        <button className="btn btn-icon btn-secondary" onClick={logout} title={t('sidebar.logout')}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
