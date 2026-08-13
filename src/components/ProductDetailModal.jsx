import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShoppingBag, Store, ShieldCheck, Tag, Check, ArrowRight } from 'lucide-react';

export const ProductDetailModal = ({ product, onClose, onOpenCart, onOpenVendorProfile }) => {
  const { addToCart, reviews, vendors, coupons, collectedVouchers, collectVoucher } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const vendor = vendors.find((v) => v.id === product.vendorId);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    const success = addToCart(product, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 850 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-shipped">{product.category.toUpperCase()}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Brand: {product.brand}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Left: Product Image & Vendor Profile Button */}
          <div>
            <div
              style={{
                width: '100%',
                height: 320,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                position: 'relative',
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {product.originalPrice > product.price && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'var(--accent-rose)',
                    color: 'white',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  SAVE BDT {(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Vendor Profile Interactive Card */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.85rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={vendor?.logo || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150'}
                  alt={product.vendorName}
                  style={{ width: 44, height: 44, borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Sold by: {product.vendorName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {vendor?.address || 'Kinbo Verified Seller Store'}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', whiteSpace: 'nowrap' }}
                onClick={() => {
                  onClose();
                  if (onOpenVendorProfile && vendor) onOpenVendorProfile(vendor);
                }}
              >
                View Store Profile <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Right: Info & Daraz Voucher Collector Widget */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {product.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-amber)', fontSize: '0.9rem' }}>
                <Star size={16} fill="var(--accent-amber)" />
                <span style={{ fontWeight: 700 }}>{product.rating}</span>
              </div>
              <span style={{ color: 'var(--text-dim)' }}>|</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {product.reviewCount} Ratings & Reviews
              </span>
            </div>

            <div style={{ marginBottom: '1rem', background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                  BDT {product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span style={{ fontSize: '1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                    BDT {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '0.2rem', fontWeight: 600 }}>
                Kinbo Delivery Guarantee & Free Return Policy
              </div>
            </div>

            {/* Daraz-Style Store Vouchers Widget */}
            <div
              style={{
                background: '#f0f9ff',
                border: '1px dashed var(--accent-blue-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Tag size={14} /> KINBO STORE VOUCHERS AVAILABLE:
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
                {coupons.slice(0, 3).map((coupon) => {
                  const isCollected = collectedVouchers.includes(coupon.code);

                  return (
                    <div
                      key={coupon.code}
                      style={{
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '0.4rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--accent-blue)' }}>
                          {coupon.code}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {coupon.discountType === 'percent' ? `${coupon.amount}% OFF` : `BDT ${coupon.amount} OFF`}
                        </div>
                      </div>

                      <button
                        onClick={() => collectVoucher(coupon.code)}
                        disabled={isCollected}
                        style={{
                          background: isCollected ? '#dcfce7' : 'var(--accent-blue)',
                          color: isCollected ? '#15803d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          cursor: isCollected ? 'default' : 'pointer',
                        }}
                      >
                        {isCollected ? '✓ Collected' : 'Collect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {product.description}
            </p>

            {/* Quantity Controls */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.4rem 0.8rem', color: 'var(--text-main)', fontWeight: 800 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0.4rem 0.8rem', fontWeight: 800, color: 'var(--text-main)', minWidth: 35, textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ padding: '0.4rem 0.8rem', color: 'var(--text-main)', fontWeight: 800 }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} /> {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                className="btn btn-outline"
                onClick={() => {
                  const success = addToCart(product, quantity);
                  if (success) {
                    onClose();
                    onOpenCart();
                  }
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Customer Reviews ({productReviews.length})
          </h3>

          {productReviews.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No reviews submitted yet for this item.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {productReviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{r.userName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-amber)', fontSize: '0.8rem' }}>
                      <Star size={14} fill="var(--accent-amber)" /> {r.rating}/5
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
