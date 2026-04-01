import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { searchJobOffers } from '../../api/axios';
import { Search, MapPin, Building, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobListPage() {
  const { isRecruiter } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ title: '', location: '', contractType: '', minSalary: '', maxSalary: '', isActive: true, page: 0, size: 9 });
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { loadJobs(); }, [filters.page]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v; });
      const res = await searchJobOffers(params);
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 0 });
    loadJobs();
  };

  const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });

  return (
    <>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>{t('jobs.title')}</h1>
          <p>{t('jobs.subtitle')}</p>
        </div>
        {isRecruiter && (
          <button className="btn btn-primary" onClick={() => navigate('/jobs/new')}>
            <Plus size={18} /> {t('jobs.postNew')}
          </button>
        )}
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder={t('jobs.searchPlaceholder')} value={filters.title} onChange={e => handleFilterChange('title', e.target.value)} />
        </div>
        <div className="filter-group">
          <input type="text" className="form-input" placeholder={t('jobs.location')} value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} style={{ width: 150 }} />
          <select className="form-select" value={filters.contractType} onChange={e => handleFilterChange('contractType', e.target.value)} style={{ width: 140 }}>
            <option value="">{t('jobs.allTypes')}</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
          <button type="submit" className="btn btn-primary">{t('jobs.search')}</button>
        </div>
      </form>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>{t('jobs.noResults')}</h3>
          <p>{t('jobs.adjustFilters')}</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`badge ${job.isActive ? 'badge-active' : 'badge-cancelled'}`}>
                    {job.isActive ? t('jobs.active') : t('jobs.closed')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="job-title">{job.title}</div>
                <div className="job-meta">
                  <span><MapPin size={14} /> {job.location || t('jobs.remote')}</span>
                  <span><Building size={14} /> {job.contractType || t('common.na')}</span>
                </div>
                <div className="job-description">{job.description}</div>
                <div className="job-footer">
                  <span className="job-salary">{job.salary ? `$${Number(job.salary).toLocaleString()}` : t('jobs.negotiable')}</span>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>by {job.recruiterName}</span>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-2" style={{ padding: '1rem 0' }}>
              <button className="btn btn-secondary btn-sm" disabled={filters.page === 0} onClick={() => handleFilterChange('page', filters.page - 1)}>
                <ChevronLeft size={16} /> {t('jobs.previous')}
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('jobs.page')} {filters.page + 1} {t('jobs.of')} {totalPages}</span>
              <button className="btn btn-secondary btn-sm" disabled={filters.page >= totalPages - 1} onClick={() => handleFilterChange('page', filters.page + 1)}>
                {t('jobs.next')} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
