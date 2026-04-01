import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/axios';
import { FileText, ExternalLink } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then(res => { setApplications(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Start by browsing <Link to="/jobs">job offers</Link> and applying to positions that interest you.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Job Title</th><th>Status</th><th>Applied Date</th><th>Cover Letter</th><th>Action</th></tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{app.jobOfferTitle}</td>
                  <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                  <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.coverLetter || '—'}</td>
                  <td>
                    <Link to={`/jobs/${app.jobOfferId}`} className="btn btn-secondary btn-sm">
                      <ExternalLink size={14} /> View Job
                    </Link>
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
