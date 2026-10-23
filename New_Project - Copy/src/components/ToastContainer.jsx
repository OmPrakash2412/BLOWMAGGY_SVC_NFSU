/* Toast System */
import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const typeStyles = {
    success: { bg: 'rgba(52, 211, 153, 0.15)', border: '#34d399', icon: '✓' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', icon: '✕' },
    info: { bg: 'rgba(158, 99, 42, 0.12)', border: '#9E632A', icon: 'ℹ' },
    warning: { bg: 'rgba(251, 191, 36, 0.15)', border: '#fbbf24', icon: '⚠' },
  };
  const style = typeStyles[toast.type] || typeStyles.info;

  return (
    <div
      className="toast animate-slide-up"
      style={{
        background: style.bg,
        borderLeft: `3px solid ${style.border}`,
        backdropFilter: 'blur(12px)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '280px',
        maxWidth: '400px',
        fontSize: 'var(--fs-sm)',
        boxShadow: 'var(--shadow-md)',
      }}
      role="alert"
    >
      <span style={{ fontSize: '1.1rem' }}>{style.icon}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ opacity: 0.5, fontSize: '1rem' }}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
