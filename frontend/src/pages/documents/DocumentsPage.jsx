import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyDocuments, uploadDocument, deleteDocument, downloadDocument } from '../../api/axios';
import { Upload, Download, Trash2, FileText, File } from 'lucide-react';

export default function DocumentsPage() {
  const { user } = useAuth();
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
    if (!confirm('Delete this document?')) return;
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
        <h1>My Documents</h1>
        <p>Upload and manage your CV and cover letters</p>
      </div>

      <div className="card mb-2">
        <h3 style={{ marginBottom: '1rem' }}>Upload Document</h3>
        <div className="flex gap-md items-center" style={{ flexWrap: 'wrap' }}>
          <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)} style={{ width: 180 }}>
            <option value="CV">CV / Resume</option>
            <option value="COVER_LETTER">Cover Letter</option>
            <option value="OTHER">Other</option>
          </select>
          <div className="file-upload-zone" onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '1.5rem' }}>
            <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }} />
            <p>{uploading ? 'Uploading...' : 'Click to select a file'}</p>
            <p className="file-types">PDF, DOC, DOCX (Max 10MB)</p>
          </div>
          <input ref={fileRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={handleUpload} />
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No documents uploaded</h3>
          <p>Upload your CV to start applying to jobs</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>File</th><th>Type</th><th>Size</th><th>Uploaded</th><th>Actions</th></tr></thead>
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
