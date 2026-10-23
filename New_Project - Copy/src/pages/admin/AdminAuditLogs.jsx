/* =========================================================
   BLOWMAGGY — Store Admin Security Audit Logs
   =========================================================
   Store Admin only:
   - Immutable audit trail of privileged operations
   - Tracks role access attempts and security denials
   ========================================================= */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import './Admin.css';

export default function AdminAuditLogs() {
  const { token, addToast, API_BASE } = useApp();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/audit-logs?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setLogs(data.logs || []);
    } catch {
      addToast('Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLogs();
  }, [token]);

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header">
        <div>
          <span className="badge badge-cyan">SECURITY & COMPLIANCE LEDGER</span>
          <h1 className="admin-title">Administrative Audit Trail</h1>
          <p className="admin-sub">Immutable record of state mutations, role elevations, and denied authorization attempts.</p>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin" className="btn btn-secondary btn-sm">← Back to Cockpit</Link>
          <button className="btn btn-primary btn-sm" onClick={fetchLogs}>Refresh Logs</button>
        </div>
      </div>

      <div className="admin-table-container glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Operator ID</th>
              <th>Role</th>
              <th>Entity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => {
              const isDenied = log.action.includes('DENIED') || log.action.includes('ATTEMPT') || log.action.includes('BLOCKED');
              const dateStr = new Date(log.timestamp).toLocaleString('en-IN');

              return (
                <tr key={log.id} style={{ background: isDenied ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{dateStr}</td>
                  <td>
                    <strong style={{ color: isDenied ? '#ef4444' : 'var(--accent-cyan)' }}>
                      {log.action}
                    </strong>
                  </td>
                  <td><code>{log.userId}</code></td>
                  <td><span className="badge badge-magenta">{log.userRole}</span></td>
                  <td>{log.entity} {log.entityId && `(${log.entityId})`}</td>
                  <td>
                    <pre style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', maxWidth: '300px', overflowX: 'auto' }}>
                      {JSON.stringify(log.details)}
                    </pre>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
