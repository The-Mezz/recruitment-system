import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getJobOffer, applyToJob, getApplicationsByJobOffer, updateApplicationStatus, deleteJobOffer } from '../../api/axios';
import { MapPin, Building, DollarSign, Calendar, ArrowLeft, Send, Trash2, Edit } from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCandidate, isRecruiter, isAdmin } = useAuth();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadJob(); }, [id]);

  const loadJob = async () => {
    try {
      const res = await getJobOffer(id);
      setJob(res.data);
      if (isRecruiter || isAdmin) {
        try {
          const appRes = await getApplicationsByJobOffer(id);
          setApplications(appRes.data);
        } catch {}
      }
    } catch { navigate('/jobs'); }
    setLoading(false);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    try {
      await applyToJob({ jobOfferId: parseInt(id), coverLetter });
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(false);
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, { status });
      loadJob();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this job offer?')) return;
    try {
      await deleteJobOffer(id);
      navigate('/jobs');
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!job) return null;

  return (
    <>
      <button className="btn btn-secondary mb-2" onClick={() => navigate('/jobs')}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="card">
        <div className="flex justify-between items-center mb-1">
          <span className={`badge ${job.isActive ? 'badge-active' : 'badge-cancelled'}`}>
            {job.isActive ? 'Active' : 'Closed'}
          </span>
          {(isRecruiter || isAdmin) && (
            <div className="flex gap-sm">
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/jobs/edit/${id}`)}><Edit size={14} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}><Trash2 size={14} /> Delete</button>
            </div>
          )}
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{job.title}</h2>

        <div className="flex gap-lg mb-2" style={{ flexWrap: 'wrap' }}>
          <span className="flex items-center gap-sm" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}><MapPin size={16} /> {job.location || 'Remote'}</span>
          <span className="flex items-center gap-sm" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}><Building size={16} /> {job.contractType || 'N/A'}</span>
          <span className="flex items-center gap-sm" style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}><DollarSign size={16} /> {job.salary ? `$${Number(job.salary).toLocaleString()}` : 'Negotiable'}</span>
          <span className="flex items-center gap-sm" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><Calendar size={16} /> Posted {new Date(job.postedDate).toLocaleDateString()}</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.description}</p>
        </div>

        {job.requirements && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Requirements</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
          </div>
        )}

        {isCandidate && !applied && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
            {error && <div style={{ background: 'var(--accent-rose-glow)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
            {!showApplyForm ? (
              <button className="btn btn-primary btn-lg" onClick={() => setShowApplyForm(true)}><Send size={18} /> Apply Now</button>
            ) : (
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label>Cover Letter (optional)</label>
                  <textarea className="form-textarea" placeholder="Tell the recruiter why you're a great fit..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4} />
                </div>
                <div className="flex gap-sm">
                  <button type="submit" className="btn btn-primary" disabled={applying}>{applying ? 'Submitting...' : 'Submit Application'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowApplyForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}
        {applied && (
          <div style={{ marginTop: '1rem', background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: 500, border: '1px solid rgba(16,185,129,0.2)' }}>
            ✓ Application submitted successfully!
          </div>
        )}
      </div>

      {(isRecruiter || isAdmin) && applications.length > 0 && (
        <div className="card mt-2">
          <div className="card-header"><h3>Applications ({applications.length})</h3></div>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr><th>Candidate</th><th>Email</th><th>Status</th><th>Applied</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{app.candidateName}</td>
                    <td>{app.candidateEmail}</td>
                    <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-sm">
                        {app.status === 'PENDING' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}>Accept</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleStatusUpdate(app.id, 'REJECTED')}>Reject</button>
                          </>
                        )}
                      </div>
                    </td>
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
