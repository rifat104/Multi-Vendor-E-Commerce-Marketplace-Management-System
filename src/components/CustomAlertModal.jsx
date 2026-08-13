import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const CustomAlertModal = ({ isOpen, title, message, type = 'info', onClose }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success' || message?.startsWith('✓') || message?.startsWith('💸') || message?.startsWith('🎁');
  const isError = type === 'error' || message?.startsWith('❌') || message?.startsWith('🚫') || message?.startsWith('⚠️');

  const theme = isSuccess
    ? { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle2 }
    : isError
    ? { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca', icon: XCircle }
    : { color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd', icon: Info };

  const ThemeIcon = theme.icon;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={onClose}>
      <div
        className="modal-content custom-alert-card"
        style={{
          maxWidth: 440,
          padding: '1.75rem',
          borderRadius: 'var(--radius-md)',
          background: 'white',
          border: `2px solid ${theme.border}`,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'var(--transition)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: theme.bg,
              color: theme.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: `0 8px 20px ${theme.border}`,
            }}
          >
            <ThemeIcon size={32} />
          </div>

          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '0.5rem',
            }}
          >
            {title || (isSuccess ? 'Success' : isError ? 'Attention Required' : 'Kinbo Marketplace Notice')}
          </h3>

          <div
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
            }}
          >
            {message}
          </div>

          <button
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={onClose}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
