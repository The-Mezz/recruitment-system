import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LayoutDashboard, FileText, Users, Calendar, FolderOpen, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout, isAdmin, isRecruiter, isCandidate } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">R</div>
        <h2>RecruitPro</h2>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Main</div>
        <Link to="/dashboard" className={isActive('/dashboard')}>
          <LayoutDashboard size={20} className="link-icon" />
          Dashboard
        </Link>
        <Link to="/jobs" className={isActive('/jobs')}>
          <Briefcase size={20} className="link-icon" />
          Job Offers
        </Link>
      </div>

      {isCandidate && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Candidate</div>
          <Link to="/my-applications" className={isActive('/my-applications')}>
            <FileText size={20} className="link-icon" />
            My Applications
          </Link>
          <Link to="/my-interviews" className={isActive('/my-interviews')}>
            <Calendar size={20} className="link-icon" />
            My Interviews
          </Link>
          <Link to="/documents" className={isActive('/documents')}>
            <FolderOpen size={20} className="link-icon" />
            My Documents
          </Link>
        </div>
      )}

      {isRecruiter && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Recruiter</div>
          <Link to="/manage-applications" className={isActive('/manage-applications')}>
            <FileText size={20} className="link-icon" />
            Applications
          </Link>
          <Link to="/interviews" className={isActive('/interviews')}>
            <Calendar size={20} className="link-icon" />
            Interviews
          </Link>
        </div>
      )}

      {isAdmin && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Admin</div>
          <Link to="/users" className={isActive('/users')}>
            <Users size={20} className="link-icon" />
            Users
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
        <button className="btn btn-icon btn-secondary" onClick={logout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
