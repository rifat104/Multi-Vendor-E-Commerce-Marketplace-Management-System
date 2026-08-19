import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { ReviewModal } from '../components/ReviewModal';
import { VendorProfileModal } from '../components/VendorProfileModal';
import {
  ShoppingBag,
  Star,
  Store,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Sparkles,
  ArrowRight,
  Filter,
  Zap,
  ShieldCheck,
  Flame,
  Tag,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

export const CustomerView = ({
  searchQuery,
  onOpenCart,
  selectedCategory: externalCategory,
  setSelectedCategory: externalSetCategory,
  onBuyNow,
}) => {
  const { products, categories, orders, currentUser, addToCart, vendors, retryPayment, reviews, archiveOrder, showAlert } = useApp();

  const [internalCategory, setInternalCategory] = useState('all');
  const selectedCategory = externalCategory !== undefined ? externalCategory : internalCategory;
  const setSelectedCategory = externalSetCategory || setInternalCategory;

  const [priceSort, setPriceSort] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVendorProfile, setSelectedVendorProfile] = useState(null);

  const [activeTab, setActiveTab] = useState('browse');
  const [orderFilterTab, setOrderFilterTab] = useState('all');
  const [reviewProduct, setReviewProduct] = useState(null);

  // Retry Payment State
  const [retryOrderId, setRetryOrderId] = useState(null);
  const [retryMethod, setRetryMethod] = useState('bKash');
  const [retryTrxId, setRetryTrxId] = useState('');

  // Flash Sale Timer State (Counts down to midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOpenOrders = (e) => {
      setActiveTab('tracking');
      setOrderFilterTab(e.detail.tab);
    };
    
    const handleGoHome = () => {
      setActiveTab('browse');
      setSelectedCategory('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('open-customer-orders', handleOpenOrders);
    window.addEventListener('go-home', handleGoHome);
    
    return () => {
      window.removeEventListener('open-customer-orders', handleOpenOrders);
      window.removeEventListener('go-home', handleGoHome);
    };
  }, [setSelectedCategory]);

  const [viewedRefundOrderIds, setViewedRefundOrderIds] = useState([]);

  // Filter Active Order Tracking (Exclude archived/cleared tracking orders)
  const customerOrders = orders.filter((o) => {
    if (o.isArchived) return false;
    if (o.customerId && currentUser?.id && o.customerId === currentUser.id) return true;
    return false;
  });

  const filteredCustomerOrders = customerOrders.filter((o) => {
    if (orderFilterTab === 'all') return true;
    if (orderFilterTab === 'to_pay') return o.paymentStatus === 'Pending' || o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'Failed';
    if (orderFilterTab === 'to_ship') return o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Ready for Courier';
    if (orderFilterTab === 'to_receive') return o.status === 'Shipped' || o.status === 'Out for Delivery';
    if (orderFilterTab === 'to_review') {
      if (o.status !== 'Delivered') return false;
      const hasUnreviewed = o.items.some(item => !reviews.find(r => r.orderId === o.id && r.productId === item.id));
      return hasUnreviewed;
    }
    return true;
  });

  // Auto-archive refunded orders after customer views tracking 1 time
  useEffect(() => {
    if (activeTab === 'tracking') {
      const refundedOrders = customerOrders.filter(
        (o) => o.status === 'Cancelled' && (o.paymentStatus === 'Done' || o.paymentStatus === 'Refunded')
      );

      refundedOrders.forEach((o) => {
        if (!viewedRefundOrderIds.includes(o.id)) {
          setViewedRefundOrderIds((prev) => [...prev, o.id]);
        }
      });
    } else {
      if (viewedRefundOrderIds.length > 0) {
        viewedRefundOrderIds.forEach((id) => archiveOrder(id));
        setViewedRefundOrderIds([]);
      }
    }
  }, [activeTab]);

  // Exclude products belonging to Suspended Vendors
  const activeProducts = products.filter((p) => {
    if (!p) return false;
    const v = vendors.find(
      (vendor) => vendor && (vendor.id === p.vendorId || (vendor.name && String(vendor.name).toLowerCase() === String(p.vendorName || '').toLowerCase()))
    );
    if (v && v.status === 'Suspended') return false;
    return true;
  });

  // Product Filtering
  const lowerSearchQuery = searchQuery ? String(searchQuery).trim().toLowerCase() : '';
  const filteredProducts = activeProducts.filter((p) => {
    if (!p) return false;
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !lowerSearchQuery ||
      (p.title && String(p.title).toLowerCase().includes(lowerSearchQuery)) ||
      (p.vendorName && String(p.vendorName).toLowerCase().includes(lowerSearchQuery)) ||
      (p.brand && String(p.brand).toLowerCase().includes(lowerSearchQuery));
    return matchesCategory && matchesSearch;
  });

  if (priceSort === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (priceSort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const flashSaleProducts = activeProducts.slice(0, 4);
  const approvedVendors = vendors.filter((v) => v.status === 'Approved');

  const handleRetrySubmit = (orderId) => {
    if ((retryMethod === 'bKash' || retryMethod === 'Nagad') && !retryTrxId) {
      showAlert('TrxID Required', 'Please enter your payment Transaction ID.', 'error');
      return;
    }
    retryPayment(orderId, retryMethod, retryTrxId);
    setRetryOrderId(null);
    setRetryTrxId('');
    showAlert('Payment Resubmitted', 'Payment retried! Order updated for MFS Admin Verification.', 'success');
  };

  return (
    <div>
      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className={`btn ${activeTab === 'browse' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('browse')}
          >
            <ShoppingBag size={18} /> Kinbo Mall Catalog ({filteredProducts.length})
          </button>

          {currentUser.isAuthenticated && (
            <button
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('orders')}
            >
              <Truck size={18} /> Order Tracking ({customerOrders.length})
            </button>
          )}
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Bangladeshi Multi-Vendor Marketplace | <strong style={{ color: 'var(--accent-blue)' }}>Kinbo</strong>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Kinbo Hero Promo Banner */}
          {!searchQuery && (
            <div
              style={{
                background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 60%, #bae6fd 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color-light)',
                padding: '2.25rem 2rem',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ maxWidth: 620, zIndex: 2 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#0284c7',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginBottom: '0.85rem',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  <Sparkles size={14} /> Kinbo Mega Shopping Festival 2026
                </div>

                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                  Buy Everything You Love Directly from Verified Sellers in Bangladesh
                </h1>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Fast delivery in Dhaka & Chattogram • Instant bKash & Nagad Cashbacks • 100% Genuine Warranty.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
                    Explore All Deals <ArrowRight size={16} />
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      const el = document.getElementById('flash-sale-sec');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Zap size={16} style={{ color: 'var(--accent-amber)' }} /> Flash Sales
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
                <img
                  src="/kinbo-logo.png"
                  alt="Kinbo Big Logo"
                  style={{ maxHeight: 180, maxWidth: 280, objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(2, 132, 199, 0.2))' }}
                />
              </div>
            </div>
          )}

          {/* Flash Sale Countdown Section */}
          {!searchQuery && (
            <div
              id="flash-sale-sec"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                border: '1px solid var(--border-color-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-blue)', fontWeight: 800, fontSize: '1.2rem' }}>
                    <Flame size={24} style={{ color: 'var(--accent-rose)' }} /> FLASH SALE
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <span>Ending in:</span>
                    <span style={{ background: 'var(--accent-blue)', color: 'white', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    :
                    <span style={{ background: 'var(--accent-blue)', color: 'white', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    :
                    <span style={{ background: 'var(--accent-blue)', color: 'white', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 700, cursor: 'pointer' }}>
                  SHOP MORE FLASH DEALS ➔
                </span>
              </div>

              {/* Flash Sale Cards */}
              <div className="responsive-product-grid">
                {flashSaleProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'var(--accent-rose)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                      }}
                    >
                      -20% OFF
                    </span>

                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', height: '2.4em', overflow: 'hidden' }}>
                      {item.title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-blue)', fontSize: '1.05rem' }}>
                        BDT {Number(item.price || 0).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                        BDT {Number(item.originalPrice || 0).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                        {item.stock} items remaining
                      </div>
                      <div style={{ width: '100%', height: 5, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KinboMall Verified Stores Grid */}
          {!searchQuery && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--accent-blue)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  KinboMall Verified Stores (Click to View Profile)
                </h3>
              </div>

              <div className="responsive-product-grid">
                {approvedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    onClick={() => setSelectedVendorProfile(vendor)}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color-light)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {vendor.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vendor.category}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: 2, fontWeight: 700 }}>
                        ★ {vendor.rating} ({vendor.reviewCount} Reviews)
                      </div>
                    </div>
                    <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                      View Store ➔
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Filter Bar */}
          <div
            id="categories-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem', flex: 1 }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: selectedCategory === cat.id ? 'var(--accent-blue)' : 'white',
                    color: selectedCategory === cat.id ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${selectedCategory === cat.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition)',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                style={{
                  background: 'white',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                <option value="default">Sort by: Relevancy</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Main Products Grid */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Just For You ({filteredProducts.length} Items)
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Package size={54} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>No matching items found</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Try searching for another product keyword or category.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div
                    className="product-img-wrapper"
                    onClick={() => setSelectedProduct(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={product.image} alt={product.title} className="product-img" />
                    {product.featured && <span className="product-badge">Featured</span>}
                    <span className="product-vendor-tag">
                      <Store size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {product.vendorName}
                    </span>
                  </div>

                  <div className="product-body">
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>
                      {product.brand}
                    </div>

                    <h3
                      className="product-title"
                      onClick={() => setSelectedProduct(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      {product.title}
                    </h3>

                    <div className="product-rating">
                      <Star size={14} fill="var(--accent-amber)" />
                      <span style={{ fontWeight: 700 }}>{product.rating}</span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({product.reviewCount})</span>
                    </div>

                    <div className="product-price-row">
                      <div>
                        <span className="price-current">BDT {Number(product.price || 0).toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="price-original">BDT {Number(product.originalPrice || 0).toLocaleString()}</span>
                        )}
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                        onClick={() => addToCart(product)}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Customer Orders List & Activity Tracker */
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            My Orders & Real-Time Shipment Progression
          </h2>
          
          <div className="tab-bar" style={{ marginBottom: '1.5rem', justifyContent: 'flex-start', overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '0.5rem', whiteSpace: 'nowrap' }}>
            <button className={`tab-btn ${orderFilterTab === 'all' ? 'active' : ''}`} onClick={() => setOrderFilterTab('all')}>All Orders</button>
            <button className={`tab-btn ${orderFilterTab === 'to_pay' ? 'active' : ''}`} onClick={() => setOrderFilterTab('to_pay')}>To Pay</button>
            <button className={`tab-btn ${orderFilterTab === 'to_ship' ? 'active' : ''}`} onClick={() => setOrderFilterTab('to_ship')}>To Ship</button>
            <button className={`tab-btn ${orderFilterTab === 'to_receive' ? 'active' : ''}`} onClick={() => setOrderFilterTab('to_receive')}>To Receive</button>
            <button className={`tab-btn ${orderFilterTab === 'to_review' ? 'active' : ''}`} onClick={() => setOrderFilterTab('to_review')}>To Review</button>
          </div>

          {filteredCustomerOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Truck size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-main)' }}>No orders in this category</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Check back later or browse other tabs!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredCustomerOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border-color)',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        Order #{order.id}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Placed on {order.date} | Payment: {order.paymentMethod} ({order.paymentTrxId})
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`badge badge-${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--accent-blue)' }}>
                        BDT {Number(order.total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Purchased Items */}
                  <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          background: 'var(--bg-tertiary)',
                          padding: '0.5rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} × BDT {Number(item.price || 0).toLocaleString()}
                          </div>
                        </div>

                        {order.status === 'Delivered' && (() => {
                          const userEmail = currentUser?.email?.toLowerCase();
                          const userId = currentUser?.id;
                          const isReviewed = reviews.some(
                            (r) =>
                              (r.productId === item.productId || r.productId === item.id) &&
                              ((userEmail && r.userEmail && r.userEmail.toLowerCase() === userEmail) || (userId && r.userId && r.userId === userId))
                          );

                          return isReviewed ? (
                            <span
                              className="badge badge-approved"
                              style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', fontWeight: 800 }}
                            >
                              ✓ Reviewed (1 Max)
                            </span>
                          ) : (
                            <button
                              className="btn btn-outline"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', marginLeft: '0.5rem', fontWeight: 700 }}
                              onClick={() => setReviewProduct({ ...item, orderId: order.id })}
                            >
                              <Star size={12} fill="var(--accent-amber)" /> Rate Product
                            </button>
                          );
                        })()}
                      </div>
                    ))}
                  </div>

                  {/* Delivered Order Completion & Clear Tracking Action Banner */}
                  {order.status === 'Delivered' && (
                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        color: '#166534',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>🎁 Delivery Completed</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                          Once reviewed or acknowledged, click to clear this order from your active tracking queue.
                        </div>
                      </div>

                      <button
                        className="btn btn-success"
                        style={{ fontSize: '0.78rem', fontWeight: 800, padding: '0.4rem 0.85rem' }}
                        onClick={() => {
                          archiveOrder(order.id);
                          showAlert('Tracking Cleared', `✓ Order #${order.id} tracking completed & cleared!`, 'success');
                        }}
                      >
                        <CheckCircle2 size={14} /> Clear Order Tracking
                      </button>
                    </div>
                  )}

                  {/* Refund Status Notice */}
                  {order.status === 'Cancelled' && (
                    <div
                      style={{
                        background: (order.paymentStatus === 'Done' || order.paymentStatus === 'Refunded') ? '#f0fdf4' : '#fff7ed',
                        border: `1px solid ${(order.paymentStatus === 'Done' || order.paymentStatus === 'Refunded') ? '#bbf7d0' : '#ffedd5'}`,
                        color: (order.paymentStatus === 'Done' || order.paymentStatus === 'Refunded') ? '#166534' : '#c2410c',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      {(order.paymentStatus === 'Done' || order.paymentStatus === 'Refunded') ? (
                        <>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                              💸 Refund Released & Status Done!
                            </div>
                            <div style={{ fontSize: '0.78rem', marginTop: 2, opacity: 0.9 }}>
                              BDT {Number(order.total || 0).toLocaleString()} has been returned to your {order.paymentMethod} account (Ref TrxID: {order.refundRefTrxId || 'REF-RELEASED'}).
                            </div>
                          </div>

                          <button
                            className="btn btn-success"
                            style={{ fontSize: '0.78rem', fontWeight: 800, padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
                            onClick={() => {
                              archiveOrder(order.id);
                              showAlert('Refund Tracking Cleared', `✓ Refund for Order #${order.id} acknowledged and tracking cleared!`, 'success');
                            }}
                          >
                            <CheckCircle2 size={15} /> Clear Refund Tracking
                          </button>
                        </>
                      ) : (
                        <div>
                          ⏳ <strong>Refund Pending Admin Approval:</strong> Seller cancelled order. BDT {Number(order.total || 0).toLocaleString()} refund is being verified by Admin and will be transferred to your {order.paymentMethod} account shortly.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Failed Retry Form */}
                  {(order.status === 'Cancelled' || order.status === 'Pending Verification' || order.paymentStatus === 'Failed') && (
                    <div
                      style={{
                        background: '#fff7ed',
                        border: '1px solid #ffedd5',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.82rem', color: '#c2410c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <AlertTriangle size={16} /> Payment Status: {order.paymentStatus}
                        </div>

                        {retryOrderId !== order.id && (
                          <button
                            className="btn btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                            onClick={() => setRetryOrderId(order.id)}
                          >
                            <RotateCcw size={14} /> Retry Payment
                          </button>
                        )}
                      </div>

                      {retryOrderId === order.id && (
                        <div style={{ marginTop: '0.75rem', borderTop: '1px solid #fed7aa', paddingTop: '0.75rem' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                            Select New Payment Method:
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {['bKash', 'Nagad', 'Cash on Delivery'].map((m) => (
                              <button
                                key={m}
                                type="button"
                                className={`role-btn ${retryMethod === m ? 'active' : ''}`}
                                onClick={() => setRetryMethod(m)}
                              >
                                {m}
                              </button>
                            ))}
                          </div>

                          {(retryMethod === 'bKash' || retryMethod === 'Nagad') && (
                            <div style={{ marginBottom: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-input"
                                placeholder={`Enter ${retryMethod} TrxID`}
                                value={retryTrxId}
                                onChange={(e) => setRetryTrxId(e.target.value.toUpperCase())}
                              />
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                              onClick={() => handleRetrySubmit(order.id)}
                            >
                              Submit Retry Payment
                            </button>
                            <button
                              className="btn btn-outline"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                              onClick={() => setRetryOrderId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline Tracker */}
                  <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      Shipment Progression Timeline:
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      {['Pending Verification', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                        const statusOrder = ['Pending Verification', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
                        const currentIndex = statusOrder.indexOf(order.status);
                        const isDone = idx <= currentIndex;

                        return (
                          <div
                            key={step}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              flex: 1,
                              position: 'relative',
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: isDone ? 'var(--accent-blue)' : 'white',
                                border: `2px solid ${isDone ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                color: isDone ? 'white' : 'var(--text-dim)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                zIndex: 2,
                              }}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: isDone ? 700 : 500,
                                color: isDone ? 'var(--accent-blue)' : 'var(--text-dim)',
                                marginTop: '0.4rem',
                                textAlign: 'center',
                              }}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenCart={onOpenCart}
          onBuyNow={() => {
            setSelectedProduct(null);
            if (onBuyNow) onBuyNow();
          }}
          onOpenVendorProfile={(vendorObj) => setSelectedVendorProfile(vendorObj)}
        />
      )}

      {selectedVendorProfile && (
        <VendorProfileModal
          vendor={selectedVendorProfile}
          onClose={() => setSelectedVendorProfile(null)}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
        />
      )}

      {reviewProduct && (
        <ReviewModal
          isOpen={true}
          product={reviewProduct}
          onClose={() => setReviewProduct(null)}
          onSuccessReview={(orderIdToArchive) => {
            if (orderIdToArchive && orderIdToArchive !== 'N/A') {
              archiveOrder(orderIdToArchive);
            }
          }}
        />
      )}
    </div>
  );
};
