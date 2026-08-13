import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, Smartphone, Tag, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = ({ isOpen, onClose, onSuccessOrder }) => {
  const { cart, currentUser, placeOrder, coupons, appliedCoupon, applyCoupon, removeCoupon } = useApp();

  const [address, setAddress] = useState(currentUser.address);
  const [phone, setPhone] = useState(currentUser.phone);
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [paymentTrxId, setPaymentTrxId] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Coupon Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.amount) / 100);
    } else {
      discountAmount = appliedCoupon.amount;
    }
  }

  const shippingFee = 120;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput) return;

    const res = applyCoupon(couponCodeInput, subtotal);
    if (res.success) {
      setCouponMessage({ text: res.message, type: 'success' });
    } else {
      setCouponMessage({ text: res.message, type: 'error' });
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!address || !phone) return;
    if ((paymentMethod === 'bKash' || paymentMethod === 'Nagad') && !paymentTrxId) {
      alert(`Please enter your ${paymentMethod} Transaction ID.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = placeOrder({
        address,
        phone,
        paymentMethod,
        paymentTrxId: paymentTrxId || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
        subtotal,
        discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : 'N/A',
        shippingFee,
        total,
      });

      setIsSubmitting(false);
      setPlacedOrderId(orderId);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/kinbo-logo.png" alt="Kinbo Logo" style={{ height: 44, objectFit: 'contain' }} />
            <h3 className="modal-title">
              {placedOrderId ? 'Order Placed!' : 'Checkout & Express Payment'}
            </h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {placedOrderId ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: '1px solid #bbf7d0',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Thank You for Ordering on Kinbo!
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Order Reference ID: <strong style={{ color: 'var(--accent-blue)' }}>#{placedOrderId}</strong>
            </p>

            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                textAlign: 'left',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Gateway:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{paymentMethod}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Coupon Applied:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{appliedCoupon.code} (-BDT {discountAmount.toLocaleString()})</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>TrxID Reference:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{paymentTrxId || 'COD-Pending'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>BDT {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={() => {
                onClose();
                onSuccessOrder();
              }}
            >
              Track Shipment Status Live
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder}>
            {/* Delivery Address */}
            <div className="form-group">
              <label className="form-label">Delivery Shipping Address</label>
              <input
                type="text"
                className="form-input"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Area, City"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Contact Phone</label>
              <input
                type="text"
                className="form-input"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Discount Coupon Code Voucher Section */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px dashed var(--accent-blue-light)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.82rem', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
                <Tag size={16} /> Have a Kinbo Discount Voucher Code?
              </div>

              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700 }}>
                    ✓ Voucher <strong>{appliedCoupon.code}</strong> Active (-BDT {discountAmount.toLocaleString()})
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 800, padding: '0.2rem 0.5rem', background: '#fee2e2', borderRadius: '4px' }}
                  >
                    Remove Voucher
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* Dropdown Selector */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>
                      Select From Available Vouchers:
                    </label>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', fontWeight: 600 }}
                      value={appliedCoupon ? appliedCoupon.code : ''}
                      onChange={(e) => {
                        const code = e.target.value;
                        if (code) {
                          setCouponCodeInput(code);
                          const res = applyCoupon(code, subtotal);
                          if (res.success) {
                            setCouponMessage({ text: res.message, type: 'success' });
                          } else {
                            setCouponMessage({ text: res.message, type: 'error' });
                          }
                        }
                      }}
                    >
                      <option value="">-- Choose a Discount Coupon Voucher --</option>
                      {coupons.map((c) => (
                        <option key={c.code} value={c.code}>
                          🎟️ {c.code} - {c.discountType === 'percent' ? `${c.amount}% OFF` : `BDT ${c.amount} OFF`} (Min BDT {c.minSpend.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Or Manual Type Input */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>
                      Or Enter / Type Voucher Code:
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Type coupon code e.g. KINBO10"
                        style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleApplyCoupon}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                      >
                        Apply Coupon
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {couponMessage.text && !appliedCoupon && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: couponMessage.type === 'success' ? '#15803d' : '#b91c1c',
                    marginTop: '0.3rem',
                    fontWeight: 600,
                  }}
                >
                  {couponMessage.text}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { id: 'bKash', name: 'bKash Mobile', color: '#e2136e' },
                  { id: 'Nagad', name: 'Nagad Mobile', color: '#f7921e' },
                  { id: 'Cash on Delivery', name: 'Cash on Delivery', color: '#10b981' },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `2px solid ${paymentMethod === pm.id ? pm.color : 'var(--border-color)'}`,
                      background: paymentMethod === pm.id ? 'var(--bg-tertiary)' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                    }}
                  >
                    <Smartphone size={16} style={{ color: pm.color }} />
                    {pm.name}
                  </div>
                ))}
              </div>
            </div>

            {/* bKash / Nagad Interactive Form */}
            {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
              <div
                style={{
                  background: 'rgba(226, 19, 110, 0.05)',
                  border: '1px solid rgba(226, 19, 110, 0.25)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#be185d', marginBottom: '0.4rem' }}>
                  {paymentMethod} Admin Official Merchant Payment:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem', lineHeight: 1.4 }}>
                  Send <strong>BDT {total.toLocaleString()}</strong> to Admin Official Account:{' '}
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem', background: '#fce7f3', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    01993006838
                  </strong>{' '}
                  and enter your TrxID below for Admin verification.
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Transaction ID (TrxID) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. BK89X20194A / NG91A827"
                    required
                    value={paymentTrxId}
                    onChange={(e) => setPaymentTrxId(e.target.value.toUpperCase())}
                  />
                </div>

                <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  🛡️ 100% Refund Guarantee: If delivery is cancelled, money will be returned to your account within 3 Working Days (72 Hours).
                </div>
              </div>
            )}

            {/* Final Order Price Breakdown */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                <span>Items Subtotal:</span>
                <span>BDT {subtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#15803d', fontWeight: 700 }}>
                  <span>Voucher Discount ({appliedCoupon.code}):</span>
                  <span>-BDT {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                <span>Delivery Fee:</span>
                <span>BDT {shippingFee.toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-blue)', paddingTop: '0.4rem', borderTop: '1px solid var(--border-color)' }}>
                <span>Total Payable</span>
                <span>BDT {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing Order...' : `Pay BDT ${total.toLocaleString()} & Confirm Order`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
