import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { getDashboardStats, getMyApplications, getRecruiterApplications, getMyInterviews, getRecruiterInterviews } from '../../api/axios';
import { Briefcase, Users, FileText, Calendar, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin, isRecruiter, isCandidate } = useAuth();
  const { t } = useLang();
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      if (isAdmin || isRecruiter) {
        const res = await getDashboardStats();
        setStats(res.data);
        if (isRecruiter) {
          const appRes = await getRecruiterApplications();
          setItems(appRes.data.slice(0, 5));
          const intRes = await getRecruiterInterviews();
          setInterviews(intRes.data.slice(0, 5));
        }
      }
      if (isCandidate) {
        const appRes = await getMyApplications();
        setItems(appRes.data);
        const intRes = await getMyInterviews();
        setInterviews(intRes.data.slice(0, 5));
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>{t('dashboard.title')}</h1>
        <p>{isAdmin ? t('dashboard.platformOverview') : isRecruiter ? t('dashboard.recruitmentActivity') : t('dashboard.jobSearchProgress')}</p>
      </div>

      {(isAdmin || isRecruiter) && stats && (
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon"><Briefcase size={22} /></div>
            <div className="stat-value">{stats.activeJobOffers}</div>
            <div className="stat-label">{t('dashboard.activeJobOffers')}</div>
          </div>
          <div className="stat-card emerald">
            <div className="stat-icon"><FileText size={22} /></div>
            <div className="stat-value">{stats.totalApplications}</div>
            <div className="stat-label">{t('dashboard.totalApplications')}</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-icon"><Clock size={22} /></div>
            <div className="stat-value">{stats.pendingApplications}</div>
            <div className="stat-label">{t('dashboard.pendingReview')}</div>
          </div>
          <div className="stat-card rose">
            <div className="stat-icon"><Calendar size={22} /></div>
            <div className="stat-value">{stats.totalInterviews}</div>
            <div className="stat-label">{t('dashboard.totalInterviews')}</div>
          </div>
        </div>
      )}

      {isCandidate && (
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon"><FileText size={22} /></div>
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">{t('dashboard.myApplications')}</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-icon"><Clock size={22} /></div>
            <div className="stat-value">{items.filter(a => a.status === 'PENDING').length}</div>
            <div className="stat-label">{t('dashboard.pending')}</div>
          </div>
          <div className="stat-card emerald">
            <div className="stat-icon"><CheckCircle size={22} /></div>
            <div className="stat-value">{items.filter(a => a.status === 'ACCEPTED').length}</div>
            <div className="stat-label">{t('dashboard.accepted')}</div>
          </div>
          <div className="stat-card rose">
            <div className="stat-icon"><XCircle size={22} /></div>
            <div className="stat-value">{items.filter(a => a.status === 'REJECTED').length}</div>
            <div className="stat-label">{t('dashboard.rejected')}</div>
          </div>
        </div>
      )}

      {isAdmin && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header"><h3>{t('dashboard.applicationsByStatus')}</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: t('dashboard.pending'), value: stats.pendingApplications, total: stats.totalApplications, color: 'var(--accent-amber)' },
                { label: t('dashboard.accepted'), value: stats.acceptedApplications, total: stats.totalApplications, color: 'var(--accent-emerald)' },
                { label: t('dashboard.rejected'), value: stats.rejectedApplications, total: stats.totalApplications, color: 'var(--accent-rose)' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1" style={{ fontSize: '0.825rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{item.value}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`, background: item.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3>{t('dashboard.platformStats')}</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { label: t('dashboard.totalUsers'), value: stats.totalUsers, icon: <Users size={16} /> },
                { label: t('dashboard.totalJobOffers'), value: stats.totalJobOffers, icon: <Briefcase size={16} /> },
                { label: t('dashboard.activeOffers'), value: stats.activeJobOffers, icon: <TrendingUp size={16} /> },
                { label: t('dashboard.totalInterviews'), value: stats.totalInterviews, icon: <Calendar size={16} /> },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-primary)' }}>
                  <div className="flex items-center gap-sm" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.icon} {item.label}</div>
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(isRecruiter || isCandidate) && items.length > 0 && (
        <div className="card mt-2">
          <div className="card-header">
            <h3>{isCandidate ? t('dashboard.recentApplications') : t('dashboard.latestApplications')}</h3>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>{t('dashboard.jobTitle')}</th>
                  {isRecruiter && <th>{t('dashboard.candidate')}</th>}
                  <th>{t('dashboard.status')}</th>
                  <th>{t('dashboard.date')}</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 5).map(app => (
                  <tr key={app.id}>
                    <td style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{app.jobOfferTitle}</td>
                    {isRecruiter && <td>{app.candidateName}</td>}
                    <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
