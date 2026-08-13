import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, onProceedCheckout }) => {
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? 120 : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          maxWidth: 420,
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
            <img src="/kinbo-logo.png" alt="Kinbo Logo" style={{ height: 38, objectFit: 'contain' }} />
            <h3 className="modal-title">My Cart ({cart.length})</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.2rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--accent-blue)' }} />
              <h4>Your Kinbo cart is empty</h4>
              <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>
                Discover thousands of products from verified sellers and add them to your cart!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    background: 'var(--bg-tertiary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '6px', background: 'white' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', margin: '0.2rem 0', fontWeight: 600 }}>
                      Vendor: {item.vendorName}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: 'auto' }}>
                      BDT {item.price.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: 'var(--accent-rose)', padding: '0.2rem' }}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        style={{ padding: '0.1rem 0.4rem', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800 }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.1rem 0.4rem', color: 'var(--text-main)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        style={{ padding: '0.1rem 0.4rem', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800 }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Totals */}
        {cart.length > 0 && (
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Subtotal</span>
              <span>BDT {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              <span>Delivery Fee</span>
              <span>BDT {shippingFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '1.25rem' }}>
              <span>Total Payable</span>
              <span>BDT {total.toLocaleString()}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
            >
              Proceed to Kinbo Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
