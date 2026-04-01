import { useState, useEffect } from 'react';
import { getRecruiterApplications, updateApplicationStatus } from '../../api/axios';
import { useLang } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function ManageApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const { t } = useLang();
  const navigate = useNavigate();

  useEffect(() => { loadApps(); }, []);

  const loadApps = async () => {
    try { const res = await getRecruiterApplications(); setApplications(res.data); } catch {}
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    try { await updateApplicationStatus(id, { status }); loadApps(); } catch (err) { console.error(err); }
  };

  const filtered = filter === 'ALL' ? applications : applications.filter(a => a.status === filter);

  // Translated filter labels
  const filterLabels = {
    ALL: `${t('common.view')} All (${applications.length})`,
    PENDING: `${t('dashboard.pending')} (${applications.filter(a => a.status === 'PENDING').length})`,
    ACCEPTED: `${t('dashboard.accepted')} (${applications.filter(a => a.status === 'ACCEPTED').length})`,
    REJECTED: `${t('dashboard.rejected')} (${applications.filter(a => a.status === 'REJECTED').length})`,
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>{t('manageApplications.title')}</h1>
        <p>{t('manageApplications.subtitle')}</p>
      </div>

      <div className="flex gap-sm mb-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
            {filterLabels[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{t('manageApplications.noApplications')}</h3>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('manageApplications.candidate')}</th>
                <th>{t('admin.email')}</th>
                <th>{t('manageApplications.jobTitle')}</th>
                <th>{t('manageApplications.status')}</th>
                <th>{t('manageApplications.appliedDate')}</th>
                <th>{t('common.edit')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{app.candidateName}</td>
                  <td>{app.candidateEmail}</td>
                  <td style={{ cursor: 'pointer', color: 'var(--accent-blue)' }} onClick={() => navigate(`/jobs/${app.jobOfferId}`)}>{app.jobOfferTitle}</td>
                  <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                  <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-sm">
                      {app.status === 'PENDING' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleStatus(app.id, 'ACCEPTED')}>{t('dashboard.accepted')}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleStatus(app.id, 'REJECTED')}>{t('dashboard.rejected')}</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
