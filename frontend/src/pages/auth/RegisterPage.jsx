import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'CANDIDATE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const { t, lang, toggleLang } = useLang();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.details?.email || t('register.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Language toggle */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <button
            onClick={toggleLang}
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.7rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
          </button>
        </div>

        <div className="logo">
          <h1><span>Recruit</span>Pro</h1>
          <p>{t('register.title')}</p>
        </div>
        {error && <div style={{ background: 'var(--accent-rose-glow)', color: 'var(--accent-rose)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid rgba(244,63,94,0.2)' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('register.firstName')}</label>
              <input type="text" name="firstName" className="form-input" placeholder="John" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t('register.lastName')}</label>
              <input type="text" name="lastName" className="form-input" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>{t('register.email')}</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('register.password')}</label>
            <input type="password" name="password" className="form-input" placeholder={t('register.passwordHint')} value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('register.phone')}</label>
              <input type="tel" name="phone" className="form-input" placeholder="+1 234 567" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>{t('register.role')}</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="CANDIDATE">{t('register.candidate')}</option>
                <option value="RECRUITER">{t('register.recruiter')}</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            <UserPlus size={18} /> {loading ? t('register.creating') : t('register.create')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {t('register.alreadyAccount')} <Link to="/login">{t('register.signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
