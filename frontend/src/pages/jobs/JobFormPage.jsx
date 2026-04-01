import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { createJobOffer, updateJobOffer, getJobOffer } from '../../api/axios';
import { Save, ArrowLeft } from 'lucide-react';

export default function JobFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLang();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', contractType: '', salary: '', requirements: '', expirationDate: '' });

  useEffect(() => {
    if (isEdit) loadJob();
  }, [id]);

  const loadJob = async () => {
    const res = await getJobOffer(id);
    const j = res.data;
    setForm({ title: j.title || '', description: j.description || '', location: j.location || '', contractType: j.contractType || '', salary: j.salary || '', requirements: j.requirements || '', expirationDate: j.expirationDate || '' });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, salary: form.salary ? parseFloat(form.salary) : null };
      if (isEdit) { await updateJobOffer(id, data); }
      else { await createJobOffer(data); }
      navigate('/jobs');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <>
      <button className="btn btn-secondary mb-2" onClick={() => navigate('/jobs')}>
        <ArrowLeft size={16} /> {t('jobs.backToJobs')}
      </button>
      <div className="card" style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: '1.5rem' }}>
          {isEdit ? t('jobs.editJobTitle') : t('jobs.newJobTitle')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('jobs.titleLabel')} *</label>
            <input name="title" className="form-input" placeholder={t('jobs.titlePlaceholder')} value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('jobs.locationLabel')}</label>
              <input name="location" className="form-input" placeholder={t('jobs.locationPlaceholder')} value={form.location} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>{t('jobs.contractType')}</label>
              <select name="contractType" className="form-select" value={form.contractType} onChange={handleChange}>
                <option value="">{t('jobs.selectType')}</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('jobs.salary')}</label>
              <input name="salary" type="number" className="form-input" placeholder={t('jobs.salaryPlaceholder')} value={form.salary} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Expiration Date</label>
              <input name="expirationDate" type="date" className="form-input" value={form.expirationDate} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>{t('jobs.description')}</label>
            <textarea name="description" className="form-textarea" placeholder={t('jobs.descriptionPlaceholder')} value={form.description} onChange={handleChange} rows={5} />
          </div>
          <div className="form-group">
            <label>{t('jobs.requirements')}</label>
            <textarea name="requirements" className="form-textarea" placeholder={t('jobs.requirementsPlaceholder')} value={form.requirements} onChange={handleChange} rows={4} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <Save size={18} /> {loading ? t('jobs.saving') : t('jobs.saveJob')}
          </button>
        </form>
      </div>
    </>
  );
}
