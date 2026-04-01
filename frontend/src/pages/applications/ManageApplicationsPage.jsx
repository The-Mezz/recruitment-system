import { useState, useEffect } from 'react';
import { getRecruiterApplications, updateApplicationStatus } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ManageApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>Manage Applications</h1>
        <p>Review and manage candidate applications</p>
      </div>

      <div className="flex gap-sm mb-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? `All (${applications.length})` : `${s} (${applications.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No applications</h3>
          <p>No {filter !== 'ALL' ? filter.toLowerCase() : ''} applications at this time.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Candidate</th><th>Email</th><th>Job Offer</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
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
                          <button className="btn btn-success btn-sm" onClick={() => handleStatus(app.id, 'ACCEPTED')}>Accept</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleStatus(app.id, 'REJECTED')}>Reject</button>
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
