import { useState, useEffect, useRef } from 'react';
import { useLang } from '../../context/LanguageContext';
import { getMyDocuments, uploadDocument, deleteDocument, downloadDocument } from '../../api/axios';
import { Upload, Download, Trash2, FileText } from 'lucide-react';

export default function DocumentsPage() {
  const { t } = useLang();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('CV');
  const fileRef = useRef();

  useEffect(() => { loadDocs(); }, []);

  const loadDocs = async () => {
    try { const res = await getMyDocuments(); setDocuments(res.data); } catch {}
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', docType);
    try { await uploadDocument(formData); loadDocs(); } catch (err) { console.error(err); }
    setUploading(false);
    fileRef.current.value = '';
  };

  const handleDownload = async (doc) => {
    try {
      const res = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('documents.confirmDelete'))) return;
    try { await deleteDocument(id); loadDocs(); } catch {}
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>{t('documents.title')}</h1>
        <p>{t('documents.subtitle')}</p>
      </div>

      <div className="card mb-2">
        <h3 style={{ marginBottom: '1rem' }}>{t('documents.uploadTitle')}</h3>
        <div className="flex gap-md items-center" style={{ flexWrap: 'wrap' }}>
          <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)} style={{ width: 180 }}>
            <option value="CV">{t('documents.cv')}</option>
            <option value="COVER_LETTER">{t('documents.coverLetter')}</option>
            <option value="OTHER">{t('documents.other')}</option>
          </select>
          <div className="file-upload-zone" onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '1.5rem' }}>
            <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }} />
            <p>{uploading ? t('documents.uploading') : t('documents.clickToUpload')}</p>
            <p className="file-types">{t('documents.fileTypes')}</p>
          </div>
          <input ref={fileRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={handleUpload} />
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>{t('documents.noDocuments')}</h3>
          <p>{t('documents.uploadCv')}</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('documents.file')}</th>
                <th>{t('documents.type')}</th>
                <th>{t('documents.size')}</th>
                <th>{t('documents.uploaded')}</th>
                <th>{t('documents.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td className="flex items-center gap-sm" style={{ color: 'var(--text-heading)', fontWeight: 500 }}>
                    <FileText size={16} style={{ color: 'var(--accent-blue)' }} /> {doc.fileName}
                  </td>
                  <td><span className="badge badge-active">{doc.type}</span></td>
                  <td>{formatSize(doc.fileSize)}</td>
                  <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-sm">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(doc)}><Download size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}><Trash2 size={14} /></button>
                    </div>
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
