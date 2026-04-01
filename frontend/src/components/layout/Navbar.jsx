import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { getUnread, getUnreadCount, markAsRead, markAllAsRead } from '../../api/axios';

export default function Navbar() {
  const { user } = useAuth();
  const { lang, toggleLang, t } = useLang();
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
    if (mins < 1) return t('navbar.justNow');
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)' }}>
          {t('navbar.welcomeBack')}, {user?.firstName} 👋
        </h3>
      </div>
      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          title={lang === 'en' ? 'Passer en français' : 'Switch to English'}
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.35rem 0.7rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          {lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
        </button>

        {/* Notifications */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button className="notification-btn" onClick={handleToggle}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {showDropdown && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <h4>{t('navbar.notifications')}</h4>
                {notifications.length > 0 && (
                  <button className="btn btn-sm btn-secondary" onClick={handleMarkAll}>
                    <Check size={14} /> {t('navbar.markAllRead')}
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {t('navbar.noNotifications')}
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
                  {t('navbar.viewAll')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
