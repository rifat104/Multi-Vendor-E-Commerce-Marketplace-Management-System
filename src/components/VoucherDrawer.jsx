import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Tag, Check, Sparkles, Store } from 'lucide-react';

export const VoucherDrawer = ({ isOpen, onClose }) => {
  const { coupons, collectedVouchers, collectVoucher } = useApp();

  if (!isOpen) return null;

  const handleCollectAll = () => {
    coupons.forEach((c) => collectVoucher(c.code));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          maxWidth: 440,
          height: '100vh',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Tag size={22} style={{ color: 'var(--accent-blue)' }} />
            <h3 className="modal-title">Kinbo Voucher Center</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Promo Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            color: 'white',
            padding: '1.25rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem' }}>
            <Sparkles size={16} /> COLLECT MORE, SAVE MORE!
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.3rem' }}>
            Public & Vendor Store Vouchers
          </h4>
          <p style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '0.2rem' }}>
            Collect vouchers now and discounts will automatically apply at checkout.
          </p>

          <button
            onClick={handleCollectAll}
            style={{
              marginTop: '0.85rem',
              background: 'white',
              color: 'var(--accent-blue)',
              fontWeight: 800,
              fontSize: '0.8rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Collect All ({coupons.length}) Vouchers
          </button>
        </div>

        {/* List of Collectible Vouchers */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {coupons.map((coupon) => {
              const isCollected = collectedVouchers.includes(coupon.code);

              return (
                <div
                  key={coupon.code}
                  style={{
                    background: isCollected ? '#f0fdf4' : 'var(--bg-tertiary)',
                    border: `1.5px dashed ${isCollected ? '#22c55e' : 'var(--accent-blue-light)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    position: 'relative',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: isCollected ? '#22c55e' : 'var(--accent-blue)',
                          color: 'white',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                        }}
                      >
                        {coupon.code}
                      </span>

                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {coupon.discountType === 'percent' ? `${coupon.amount}% OFF` : `BDT ${coupon.amount} OFF`}
                      </span>

                      {coupon.scope === 'vendor' ? (
                        <span className="badge badge-shipped" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                          <Store size={10} style={{ display: 'inline', marginRight: 2 }} />
                          {coupon.vendorName}
                        </span>
                      ) : (
                        <span className="badge badge-approved" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                          Public Voucher
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {coupon.description}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      Min spend BDT {coupon.minSpend.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => collectVoucher(coupon.code)}
                    disabled={isCollected}
                    style={{
                      background: isCollected ? '#dcfce7' : 'linear-gradient(135deg, #0284c7, #38bdf8)',
                      color: isCollected ? '#15803d' : 'white',
                      border: `1px solid ${isCollected ? '#bbf7d0' : 'transparent'}`,
                      borderRadius: 'var(--radius-full)',
                      padding: '0.45rem 0.85rem',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: isCollected ? 'default' : 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {isCollected ? (
                      <>
                        <Check size={14} /> Collected
                      </>
                    ) : (
                      'Collect'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
