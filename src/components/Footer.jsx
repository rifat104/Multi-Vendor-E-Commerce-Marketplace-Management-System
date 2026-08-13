import React from 'react';
import { ShieldCheck, Truck, Headphones, RotateCcw, CreditCard } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '2.5rem',
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}
    >
      {/* 4 Value Pillars Bar */}
      <div
        style={{
          maxWidth: 1350,
          margin: '0 auto',
          padding: '0 1.5rem 2rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Truck size={32} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>Fast Delivery</div>
            <div style={{ fontSize: '0.78rem' }}>Across 64 Districts in Bangladesh</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <RotateCcw size={32} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>7 Days Return</div>
            <div style={{ fontSize: '0.78rem' }}>Easy money-back guarantee</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <ShieldCheck size={32} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>100% Authentic</div>
            <div style={{ fontSize: '0.78rem' }}>From Verified KinboMall Sellers</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Headphones size={32} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>24/7 Customer Care</div>
            <div style={{ fontSize: '0.78rem' }}>Hotline: +880 9610-000000</div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div
        style={{
          maxWidth: 1350,
          margin: '0 auto',
          padding: '2rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}
      >
        <div>
          <img
            src="/kinbo-logo.png"
            alt="Kinbo"
            style={{ height: 58, objectFit: 'contain', marginBottom: '0.85rem' }}
          />
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Kinbo is the premier multi-vendor e-commerce marketplace in Bangladesh connecting millions of buyers with thousands of verified local sellers.
          </p>
        </div>

        <div>
          <h4 style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.85rem' }}>Customer Care</h4>
          <ul style={{ listStyle: 'none', lineHeight: 1.9, fontSize: '0.82rem' }}>
            <li>Help Center & FAQ</li>
            <li>How to Buy on Kinbo</li>
            <li>Returns & Refunds</li>
            <li>Kinbo Express Delivery</li>
            <li>Terms & Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.85rem' }}>Earn With Kinbo</h4>
          <ul style={{ listStyle: 'none', lineHeight: 1.9, fontSize: '0.82rem' }}>
            <li>Sell on Kinbo (Become a Vendor)</li>
            <li>Code of Conduct for Sellers</li>
            <li>Kinbo Logistics Partner</li>
            <li>Affiliate Program</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.85rem' }}>Secure Payment Methods</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {['bKash Mobile Banking', 'Nagad Mobile', 'Cash on Delivery'].map((pm) => (
              <span
                key={pm}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                }}
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        style={{
          background: 'var(--bg-tertiary)',
          borderTop: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        © 2026 Kinbo E-Commerce Marketplace Inc. All Rights Reserved.
      </div>
    </footer>
  );
};
