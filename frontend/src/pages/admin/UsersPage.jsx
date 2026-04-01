import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../api/axios';
import { useLang } from '../../context/LanguageContext';
import { Trash2, Users } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const res = await getUsers(); setUsers(res.data); } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try { await deleteUser(id); loadUsers(); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>{t('admin.usersTitle')}</h1>
        <p>{t('admin.usersSubtitle')}</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card blue">
          <div className="stat-icon"><Users size={22} /></div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">{t('dashboard.totalUsers')}</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon">👤</div>
          <div className="stat-value">{users.filter(u => u.role === 'CANDIDATE').length}</div>
          <div className="stat-label">{t('register.candidate')}s</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{users.filter(u => u.role === 'RECRUITER').length}</div>
          <div className="stat-label">{t('register.recruiter')}s</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-icon">🛡️</div>
          <div className="stat-value">{users.filter(u => u.role === 'ADMIN').length}</div>
          <div className="stat-label">{t('sidebar.admin')}</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.email')}</th>
              <th>{t('admin.phone')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('documents.uploaded')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
