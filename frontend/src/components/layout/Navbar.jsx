import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUnread, getUnreadCount, markAsRead, markAllAsRead } from '../../api/axios';

export default function Navbar() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data.count);
    } catch (err) { /* ignore */ }
  };

  const loadNotifications = async () => {
    try {
      const res = await getUnread();
      setNotifications(res.data);
    } catch (err) { /* ignore */ }
  };

  const handleToggle = () => {
    if (!showDropdown) loadNotifications();
    setShowDropdown(!showDropdown);
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setNotifications([]);
    setUnreadCount(0);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)' }}>
          Welcome back, {user?.firstName} 👋
        </h3>
      </div>
      <div className="navbar-right">
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button className="notification-btn" onClick={handleToggle}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {showDropdown && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <h4>Notifications</h4>
                {notifications.length > 0 && (
                  <button className="btn btn-sm btn-secondary" onClick={handleMarkAll}>
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="notification-item unread" onClick={() => handleMarkRead(n.id)}>
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-time">{timeAgo(n.date)}</div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border-primary)', textAlign: 'center' }}>
                <Link to="/notifications" className="btn btn-sm btn-secondary btn-full" onClick={() => setShowDropdown(false)}>
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
