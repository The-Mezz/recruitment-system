import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { getMyInterviews, getRecruiterInterviews, createInterview, updateInterview, getRecruiterApplications } from '../../api/axios';
import { Calendar, Clock, MapPin, MessageSquare, Plus } from 'lucide-react';

export default function InterviewsPage() {
  const { isRecruiter, isCandidate } = useAuth();
  const { t } = useLang();
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ applicationId: '', date: '', location: '', notes: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = isRecruiter ? await getRecruiterInterviews() : await getMyInterviews();
      setInterviews(res.data);
      if (isRecruiter) {
        const appRes = await getRecruiterApplications();
        setApplications(appRes.data.filter(a => a.status === 'ACCEPTED' || a.status === 'PENDING'));
      }
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInterview({ ...form, applicationId: parseInt(form.applicationId) });
      setShowForm(false);
      setForm({ applicationId: '', date: '', location: '', notes: '' });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleComplete = async (id) => {
    const feedback = prompt(t('interviews.feedbackPrompt'));
    if (feedback === null) return;
    try {
      await updateInterview(id, { status: 'COMPLETED', feedback });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleCancel = async (id) => {
    if (!confirm(t('interviews.cancelConfirm'))) return;
    try { await updateInterview(id, { status: 'CANCELLED' }); loadData(); } catch {}
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>{isCandidate ? t('interviews.myTitle') : t('interviews.title')}</h1>
          <p>{isCandidate ? t('interviews.mySubtitle') : t('interviews.subtitle')}</p>
        </div>
        {isRecruiter && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> {t('interviews.scheduleNew')}
          </button>
        )}
      </div>

      {showForm && isRecruiter && (
        <div className="card mb-2">
          <h3 style={{ marginBottom: '1rem' }}>{t('interviews.scheduleTitle')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('interviews.application')}</label>
              <select className="form-select" value={form.applicationId} onChange={e => setForm({ ...form, applicationId: e.target.value })} required>
                <option value="">{t('interviews.selectApplication')}</option>
                {applications.map(a => (
                  <option key={a.id} value={a.id}>{a.candidateName} — {a.jobOfferTitle}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('interviews.dateTime')}</label>
                <input type="datetime-local" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{t('interviews.locationLabel')}</label>
                <input className="form-input" placeholder={t('interviews.locationPlaceholder')} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('interviews.notes')}</label>
              <textarea className="form-textarea" placeholder={t('interviews.notesPlaceholder')} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <div className="flex gap-sm">
              <button type="submit" className="btn btn-primary">{t('interviews.schedule')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>{t('interviews.cancel')}</button>
            </div>
          </form>
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>{t('interviews.noInterviews')}</h3>
          <p>{isCandidate ? t('interviews.noScheduledCandidate') : t('interviews.noScheduledRecruiter')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {interviews.map(inv => (
            <div key={inv.id} className="card">
              <div className="flex justify-between items-center">
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{inv.jobOfferTitle}</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('interviews.candidateLabel')} {inv.candidateName}</span>
                </div>
                <span className={`badge badge-${inv.status.toLowerCase()}`}>{inv.status}</span>
              </div>
              <div className="flex gap-lg mt-1" style={{ flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-sm"><Calendar size={14} /> {new Date(inv.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-sm"><Clock size={14} /> {new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {inv.location && <span className="flex items-center gap-sm"><MapPin size={14} /> {inv.location}</span>}
              </div>
              {inv.feedback && (
                <div className="mt-1" style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  <span className="flex items-center gap-sm mb-1" style={{ fontWeight: 600, color: 'var(--text-heading)' }}><MessageSquare size={14} /> {t('interviews.feedback')}</span>
                  <p style={{ color: 'var(--text-secondary)' }}>{inv.feedback}</p>
                </div>
              )}
              {isRecruiter && inv.status === 'SCHEDULED' && (
                <div className="flex gap-sm mt-1">
                  <button className="btn btn-success btn-sm" onClick={() => handleComplete(inv.id)}>{t('interviews.complete')}</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(inv.id)}>{t('interviews.cancelInterview')}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
