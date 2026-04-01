import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'CANDIDATE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
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
      setError(err.response?.data?.message || err.response?.data?.details?.email || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="logo">
          <h1><span>Recruit</span>Pro</h1>
          <p>Create your account</p>
        </div>
        {error && <div style={{ background: 'var(--accent-rose-glow)', color: 'var(--accent-rose)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid rgba(244,63,94,0.2)' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" className="form-input" placeholder="John" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" className="form-input" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" className="form-input" placeholder="+1 234 567" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="CANDIDATE">Candidate</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
