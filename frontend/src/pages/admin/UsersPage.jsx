import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../api/axios';
import { Trash2, Users } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { const res = await getUsers(); setUsers(res.data); } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try { await deleteUser(id); loadUsers(); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage platform users and roles</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card blue">
          <div className="stat-icon"><Users size={22} /></div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon">👤</div>
          <div className="stat-value">{users.filter(u => u.role === 'CANDIDATE').length}</div>
          <div className="stat-label">Candidates</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{users.filter(u => u.role === 'RECRUITER').length}</div>
          <div className="stat-label">Recruiters</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-icon">🛡️</div>
          <div className="stat-value">{users.filter(u => u.role === 'ADMIN').length}</div>
          <div className="stat-label">Admins</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
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
