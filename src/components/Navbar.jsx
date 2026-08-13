import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Bell, Search, Store, Tag, MoreVertical, X } from 'lucide-react';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  onOpenCart,
  onOpenRegisterVendor,
  onOpenVouchers,
  onOpenSideMenu,
  onSelectProduct,
}) => {
  const {
    activeRole,
    cart,
    notifications,
    currentUser,
    collectedVouchers,
    products,
    markNotificationsAsRead,
    clearNotification,
    clearAllNotifications,
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check authentication status
  const isLoggedIn = Boolean(currentUser && currentUser.isAuthenticated && currentUser.id !== 'guest' && currentUser.email);

  // Filter notifications strictly by logged-in user account & role
  const userNotifications = !isLoggedIn
    ? [] // When logged out, DON'T show any account notifications!
    : notifications.filter((n) => {
        if (currentUser.role === 'admin' || activeRole === 'admin') {
          return n.targetRole === 'Admin';
        }
        if (currentUser.role === 'vendor' || activeRole === 'vendor') {
          return (
            n.targetVendorId === currentUser.vendorId ||
            (n.targetRole === 'Vendor' && (!n.targetVendorId || n.targetVendorId === currentUser.id))
          );
        }
        // Customer or Delivery Rider
        return (
          n.targetUserId === currentUser.id ||
          (n.targetRole === 'Customer' && (!n.targetUserId || n.targetUserId === currentUser.id)) ||
          (n.targetRole === 'Delivery' && n.targetUserId === currentUser.id)
        );
      });

  const unreadNotifs = userNotifications.filter((n) => !n.read);

  // Live Auto-Complete Product Matching
  const matchingSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    const nextState = !showNotifs;
    setShowNotifs(nextState);
    if (nextState && unreadNotifs.length > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <header className="navbar">
      {/* Brand Logo */}
      <div className="nav-brand">
        <img
          src="/kinbo-logo.png"
          alt="Kinbo E-Commerce Marketplace"
          className="nav-logo-img"
        />
      </div>

      {activeRole === 'customer' && (
        <div className="nav-search" ref={searchRef} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search in Kinbo (Products, Brands, Vendors)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {searchQuery ? (
            <button
              className="nav-search-btn"
              title="Clear search"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              style={{ background: 'none', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          ) : (
            <button className="nav-search-btn" title="Search">
              <Search size={18} />
            </button>
          )}

          {/* Daraz-Style Live Product Suggestions Auto-Complete Dropdown */}
          {showSuggestions && searchQuery.trim().length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                zIndex: 250,
                marginTop: '4px',
                maxHeight: '380px',
                overflowY: 'auto',
              }}
            >
              {matchingSuggestions.length === 0 ? (
                <div style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No products found matching "<strong>{searchQuery}</strong>"
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--accent-blue)',
                      background: '#f0f9ff',
                      borderBottom: '1px solid var(--border-color-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>PRODUCT SUGGESTIONS FOR "{searchQuery.toUpperCase()}"</span>
                    <span>{matchingSuggestions.length} Matches</span>
                  </div>

                  {matchingSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowSuggestions(false);
                        if (onSelectProduct) onSelectProduct(item);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        borderBottom: '1px solid var(--border-color-light)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: 44,
                          height: 44,
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color-light)',
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            color: 'var(--text-main)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Brand: {item.brand} • Sold by {item.vendorName}
                        </div>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-blue)', whiteSpace: 'nowrap' }}>
                        BDT {item.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="nav-actions">
        {activeRole === 'customer' && (
          <>
            <button
              className="btn btn-outline"
              onClick={onOpenVouchers}
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', borderColor: 'var(--border-color-light)', background: '#f0f9ff', color: 'var(--accent-blue)' }}
            >
              <Tag size={15} /> Vouchers ({collectedVouchers.length})
            </button>

            {currentUser.role !== 'vendor' && (
              <button
                className="btn btn-outline"
                onClick={onOpenRegisterVendor}
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', borderColor: 'var(--border-color-light)', background: 'var(--bg-tertiary)' }}
              >
                <Store size={15} style={{ color: 'var(--accent-blue)' }} /> Sell on Kinbo
              </button>
            )}

            <button className="icon-btn" onClick={onOpenCart} title="Shopping Cart">
              <ShoppingBag size={20} style={{ color: 'var(--text-main)' }} />
              {totalCartCount > 0 && <span className="badge-count">{totalCartCount}</span>}
            </button>
          </>
        )}

        {activeRole === 'delivery' && (
          <span className="badge badge-approved" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            🚚 Delivery Agent: {currentUser.name}
          </span>
        )}

        {/* Bell Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={handleToggleNotifications}
            title="Notifications"
          >
            <Bell size={20} style={{ color: 'var(--text-main)' }} />
            {unreadNotifs.length > 0 && <span className="badge-count">{unreadNotifs.length}</span>}
          </button>

          {showNotifs && (
            <div
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: 350,
                background: '#ffffff',
                border: '1px solid var(--border-color-light)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 150,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '0.5rem',
                }}
              >
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Notifications ({userNotifications.length})
                </h4>

                {isLoggedIn && userNotifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent-rose)',
                      fontWeight: 700,
                      background: '#fee2e2',
                      border: 'none',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {!isLoggedIn ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                    <Bell size={32} style={{ color: 'var(--text-dim)', marginBottom: '0.4rem' }} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Please sign in to view your account notifications.
                    </p>
                  </div>
                ) : userNotifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                    <Bell size={32} style={{ color: 'var(--text-dim)', marginBottom: '0.4rem' }} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      No new notifications for your account.
                    </p>
                  </div>
                ) : (
                  userNotifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '0.4rem',
                        background: n.read ? 'var(--bg-tertiary)' : '#e0f2fe',
                        borderLeft: `3px solid ${n.read ? 'var(--border-color)' : 'var(--accent-blue)'}`,
                        position: 'relative',
                      }}
                    >
                      <button
                        onClick={() => clearNotification(n.id)}
                        title="Dismiss notification"
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>

                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)', paddingRight: '1.2rem' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                        {n.time}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3-Dots Slide Menu Icon (Daraz Style) */}
        <button
          className="icon-btn"
          onClick={onOpenSideMenu}
          title="Open Menu Drawer"
          style={{ background: 'var(--accent-blue-bg)', borderColor: 'var(--accent-blue-light)' }}
        >
          <MoreVertical size={22} style={{ color: 'var(--accent-blue)' }} />
        </button>
      </div>
    </header>
  );
};
