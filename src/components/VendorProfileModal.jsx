import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Store, Star, ShieldCheck, MapPin, Phone, Award, ShoppingBag, Package } from 'lucide-react';

export const VendorProfileModal = ({ vendor, onClose, onSelectProduct }) => {
  const { products, addToCart } = useApp();

  if (!vendor) return null;

  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 850, padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Image */}
        <div style={{ position: 'relative', height: 160, width: '100%', background: '#0284c7' }}>
          <img
            src={vendor.banner || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80'}
            alt={vendor.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            className="close-btn"
            onClick={onClose}
            style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: 'white' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Store Header Info */}
        <div style={{ padding: '1.5rem', background: 'white', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginTop: -50, marginBottom: '1rem' }}>
            <img
              src={vendor.logo}
              alt={vendor.name}
              style={{
                width: 90,
                height: 90,
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                border: '4px solid white',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                background: 'white',
              }}
            />

            <div style={{ flex: 1, paddingTop: 45 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{vendor.name}</h2>
                <span className="badge badge-approved">
                  <ShieldCheck size={14} /> Verified Seller Store
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Category: {vendor.category} • Member Since {vendor.joinedDate || '2024'}
              </p>
            </div>
          </div>

          {/* Metrics & Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.85rem',
              background: 'var(--bg-tertiary)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-color)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Store Rating:</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={16} fill="var(--accent-amber)" /> {vendor.rating || 5.0} / 5.0 ({vendor.reviewCount || 42} Ratings)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trade License:</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {vendor.tradeLicense || 'TRAD/2026/KINBO'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Store Location:</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {vendor.address || 'Dhaka, Bangladesh'}
              </div>
            </div>
          </div>

          {/* Store Products List */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} style={{ color: 'var(--accent-blue)' }} /> Products Sold by {vendor.name} ({vendorProducts.length})
          </h3>

          {vendorProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No active products listed in this store currently.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
              {vendorProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem', cursor: 'pointer' }}
                    onClick={() => {
                      onClose();
                      if (onSelectProduct) onSelectProduct(product);
                    }}
                  />
                  <div
                    style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', height: '2.4em', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => {
                      onClose();
                      if (onSelectProduct) onSelectProduct(product);
                    }}
                  >
                    {product.title}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '0.95rem' }}>
                      BDT {product.price.toLocaleString()}
                    </span>

                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => addToCart(product)}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
