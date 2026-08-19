import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  ShoppingBag,
  Store,
  ShieldCheck,
  Truck,
  Tag,
  LogOut,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Lock,
  Clock,
  Package
} from 'lucide-react';

export const SideMenuDrawer = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenVouchers,
  onOpenRegisterVendor,
  onSelectCategory,
}) => {
  const { currentUser, activeRole, setActiveRole, logout, categories, vendors } = useApp();

  if (!isOpen) return null;

  const userVendor = vendors.find((v) => v.email === currentUser.email);
  const isApprovedVendor = userVendor && userVendor.status === 'Approved';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          maxWidth: 380,
          height: '100vh',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.25s ease-out',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            color: 'white',
            padding: '1.25rem 1.25rem 1.5rem 1.25rem',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>

          <img
            src="/kinbo-logo.png"
            alt="Kinbo Marketplace Logo"
            style={{ height: 50, width: 'auto', display: 'block', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '1rem' }}
          />

          {currentUser.isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'white',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>{currentUser.email}</div>
                <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.5rem', borderRadius: 10, display: 'inline-block', marginTop: 2 }}>
                  Role: {currentUser.role.toUpperCase()}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>Welcome to Kinbo!</div>
              <p style={{ fontSize: '0.78rem', opacity: 0.9, marginBottom: '0.75rem' }}>
                Login to access your orders, cart, and seller portal.
              </p>
              <button
                className="btn"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                style={{ background: 'white', color: 'var(--accent-blue)', fontWeight: 800, fontSize: '0.8rem', padding: '0.4rem 1rem' }}
              >
                <Lock size={14} /> Login / Register Now
              </button>
            </div>
          )}
        </div>

        {/* Sliding Menu Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>

          {/* Section 1: Dashboard Navigation */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Portals & Dashboards
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {activeRole !== 'delivery' && (
                <button
                  onClick={() => {
                    setActiveRole('customer');
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activeRole === 'customer' ? '#e0f2fe' : 'var(--bg-tertiary)',
                    color: activeRole === 'customer' ? 'var(--accent-blue)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShoppingBag size={18} /> Customer Marketplace
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}

              {(isApprovedVendor || currentUser.role === 'vendor') && activeRole !== 'delivery' && (
                <button
                  onClick={() => {
                    setActiveRole('vendor');
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activeRole === 'vendor' ? '#e0f2fe' : 'var(--bg-tertiary)',
                    color: activeRole === 'vendor' ? 'var(--accent-blue)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Store size={18} /> Vendor Dashboard
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}

              {(currentUser.role === 'delivery' || activeRole === 'delivery') && (
                <button
                  onClick={() => {
                    setActiveRole('delivery');
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activeRole === 'delivery' ? '#e0f2fe' : 'var(--bg-tertiary)',
                    color: activeRole === 'delivery' ? 'var(--accent-blue)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Truck size={18} /> Delivery Logistics Console
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}

              {(currentUser.role === 'admin' || currentUser.email === 'admin1234@gmail.com') && activeRole !== 'delivery' && (
                <button
                  onClick={() => {
                    setActiveRole('admin');
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activeRole === 'admin' ? '#e0f2fe' : 'var(--bg-tertiary)',
                    color: activeRole === 'admin' ? 'var(--accent-blue)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShieldCheck size={18} /> Admin Panel
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          {activeRole !== 'delivery' && (
            <>
              {/* Section 2: Quick Features */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Quick Features
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVouchers();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    <Tag size={18} style={{ color: 'var(--accent-blue)' }} /> Kinbo Vouchers & Coupons
                  </button>

                  {!isApprovedVendor && currentUser.role !== 'vendor' && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRegisterVendor();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      <Store size={18} style={{ color: 'var(--accent-blue)' }} /> Sell on Kinbo (Become Vendor)
                    </button>
                  )}
                </div>
              </div>

              {/* Section 3: Clickable Categories List */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Product Categories
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(c.id);
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.84rem',
                        color: 'var(--text-main)',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-sm)',
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <span>{c.name}</span>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Logout */}
        {currentUser.isAuthenticated && (
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="btn btn-outline"
              style={{ width: '100%', color: 'var(--accent-rose)', borderColor: '#fecaca' }}
            >
              <LogOut size={16} /> Logout from Kinbo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
