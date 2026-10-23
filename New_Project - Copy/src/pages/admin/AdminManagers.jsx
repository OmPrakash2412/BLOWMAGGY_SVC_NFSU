/* =========================================================
   BLOWMAGGY — Admin Department Manager Management
   =========================================================
   Store Admin only:
   - View all provisioned Department Managers
   - Provision new Department Managers
   - Assign/reassign managers to specific departments
   - Deactivate or reactivate manager accounts
   ========================================================= */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { DEPARTMENTS } from '../../data/catalog.js';
import './Admin.css';

export default function AdminManagers() {
  const { token, addToast, API_BASE } = useApp();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New manager form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('fashion');
  const [creating, setCreating] = useState(false);

  // Assignment form state
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [assignDept, setAssignDept] = useState('fashion');

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/managers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setManagers(data.managers || []);
        if (data.managers?.length > 0 && !selectedManagerId) {
          setSelectedManagerId(data.managers[0].id);
        }
      }
    } catch {
      addToast('Failed to load manager accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchManagers();
  }, [token]);

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/admin/managers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          fullName: newName,
          departmentId: newDept
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Provisioning failed');

      addToast(`Manager account '${newEmail}' provisioned for ${newDept.toUpperCase()}`, 'success');
      setNewEmail('');
      setNewPassword('');
      setNewName('');
      fetchManagers();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleAssignDepartment = async (e) => {
    e.preventDefault();
    if (!selectedManagerId) return;

    try {
      const res = await fetch(`${API_BASE}/admin/managers/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedManagerId,
          departmentId: assignDept
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Assignment failed');

      addToast(data.message, 'success');
      fetchManagers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleStatus = async (managerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
      const res = await fetch(`${API_BASE}/admin/users/${managerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Status update failed');

      addToast(`Account status updated to '${newStatus}'`, 'info');
      fetchManagers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header">
        <div>
          <span className="badge badge-magenta">STORE ADMIN GOVERNANCE</span>
          <h1 className="admin-title">Department Manager Governance</h1>
          <p className="admin-sub">Provision managers, assign department authorizations, and enforce least privilege.</p>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin" className="btn btn-secondary btn-sm">← Back to Cockpit</Link>
          <Link to="/admin/audit-logs" className="btn btn-secondary btn-sm">Audit Logs</Link>
        </div>
      </div>

      <div className="admin-sections-grid">
        {/* Provision Manager Form */}
        <div className="admin-section glass-card">
          <h3>Provision New Department Manager</h3>
          <p className="section-instruction">Create privileged account and immediately assign primary department scope.</p>

          <form onSubmit={handleCreateManager} className="admin-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Chen"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Work Email</label>
              <input
                type="email"
                required
                placeholder="manager.home@blowmaggy.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Initial Temporary Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label>Authorized Initial Department</label>
              <select
                value={newDept}
                onChange={e => setNewDept(e.target.value)}
                className="input-field"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.subtitle})</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={creating} className="btn btn-primary">
              {creating ? 'Provisioning...' : 'Provision Department Manager'}
            </button>
          </form>
        </div>

        {/* Assign Department to Existing Manager */}
        <div className="admin-section glass-card">
          <h3>Assign Department Authorization</h3>
          <p className="section-instruction">Grant an existing manager access to an additional department continuum.</p>

          <form onSubmit={handleAssignDepartment} className="admin-form">
            <div className="input-group">
              <label>Select Department Manager</label>
              <select
                value={selectedManagerId}
                onChange={e => setSelectedManagerId(e.target.value)}
                className="input-field"
              >
                {managers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Authorize Department Access</label>
              <select
                value={assignDept}
                onChange={e => setAssignDept(e.target.value)}
                className="input-field"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.subtitle})</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-secondary">
              Grant Department Access
            </button>
          </form>
        </div>
      </div>

      {/* Managers Ledger Table */}
      <div className="admin-table-container glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Manager Name</th>
              <th>Email</th>
              <th>Assigned Department(s)</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map(m => (
              <tr key={m.id}>
                <td><code>{m.id}</code></td>
                <td><strong>{m.fullName}</strong></td>
                <td>{m.email}</td>
                <td>
                  <div className="dept-tags-row">
                    {m.assignedDepartments.map(d => (
                      <span key={d} className="badge badge-cyan">{d.toUpperCase()}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${m.status === 'ACTIVE' ? 'in-stock' : 'out-of-stock'}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleToggleStatus(m.id, m.status)}
                  >
                    {m.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
