import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/axios';
import { useLang } from '../../context/LanguageContext';
import { ExternalLink } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getMyApplications().then(res => { setApplications(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>{t('myApplications.title')}</h1>
        <p>{t('myApplications.subtitle')}</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{t('myApplications.noApplications')}</h3>
          <p>{t('myApplications.browseJobs')} <Link to="/jobs">{t('myApplications.jobOffers')}</Link> {t('myApplications.andApplying')}</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('myApplications.jobTitle')}</th>
                <th>{t('myApplications.status')}</th>
                <th>{t('myApplications.appliedDate')}</th>
                <th>{t('myApplications.coverLetter')}</th>
                <th>{t('myApplications.action')}</th>
              </tr>
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
                      <ExternalLink size={14} /> {t('myApplications.viewJob')}
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
