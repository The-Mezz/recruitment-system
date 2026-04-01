import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/axios';
import { useLang } from '../../context/LanguageContext';
import { Check, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => { loadNotifs(); }, []);

  const loadNotifs = async () => {
    try { const res = await getNotifications(); setNotifications(res.data); } catch {}
    setLoading(false);
  };

  const handleRead = async (id) => {
    try { await markAsRead(id); loadNotifs(); } catch {}
  };

  const handleReadAll = async () => {
    try { await markAllAsRead(); loadNotifs(); } catch {}
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>{t('notifications.title')}</h1>
          <p>{t('notifications.subtitle')}</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button className="btn btn-secondary" onClick={handleReadAll}>
            <CheckCheck size={16} /> {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>{t('notifications.noNotifications')}</h3>
          <p>{t('notifications.noNotificationsDesc')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notifications.map(n => (
            <div key={n.id} className="card" style={{ padding: '1rem 1.25rem', borderLeft: !n.isRead ? '3px solid var(--accent-blue)' : '3px solid transparent', background: !n.isRead ? 'var(--accent-blue-glow)' : undefined }}>
              <div className="flex justify-between items-center">
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-heading)', fontWeight: n.isRead ? 400 : 500 }}>{n.message}</p>
                  <div className="flex items-center gap-sm mt-1">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.date).toLocaleString()}</span>
                    {n.type && <span className="badge badge-active" style={{ fontSize: '0.6rem' }}>{n.type.replace('_', ' ')}</span>}
                  </div>
                </div>
                {!n.isRead && (
                  <button className="btn btn-icon btn-secondary" onClick={() => handleRead(n.id)} title={t('notifications.markRead')}>
                    <Check size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
