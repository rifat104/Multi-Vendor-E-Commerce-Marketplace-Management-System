import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddProductModal } from '../components/AddProductModal';
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  XCircle,
  FileSpreadsheet,
  Box,
  Truck,
  Edit3,
  CreditCard,
  ArrowUpRight,
  Clock,
  Tag,
} from 'lucide-react';

import { VendorAnalyticsConsole } from '../components/VendorAnalyticsConsole';

export const VendorView = () => {
  const {
    vendors,
    activeVendorId,
    currentUser,
    products,
    orders,
    coupons,
    addVendorVoucher,
    deleteVoucher,
    payoutRequests,
    requestVendorPayout,
    deleteProduct,
    vendorProcessOrder,
    updateVendorProfile,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);

  // Vendor Store Voucher Creation State
  const [vCode, setVCode] = useState('');
  const [vDiscountType, setVDiscountType] = useState('percent');
  const [vAmount, setVAmount] = useState('10');
  const [vMinSpend, setVMinSpend] = useState('500');
  const [vDescription, setVDescription] = useState('');

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [payoutBankDetails, setPayoutBankDetails] = useState('');
  const [payoutMessage, setPayoutMessage] = useState('');

  // Match current vendor store by activeVendorId OR by logged in user's email
  const vendor =
    vendors.find((v) => v.id === activeVendorId || (currentUser.email && v.email.toLowerCase() === currentUser.email.toLowerCase())) ||
    vendors[0];

  // Edit Profile Form State
  const [storeName, setStoreName] = useState(vendor.name);
  const [ownerName, setOwnerName] = useState(vendor.ownerName);
  const [logoUrl, setLogoUrl] = useState(vendor.logo);
  const [bannerUrl, setBannerUrl] = useState(vendor.banner || '');
  const [phone, setPhone] = useState(vendor.phone);
  const [address, setAddress] = useState(vendor.address);
  const [bankDetails, setBankDetails] = useState(vendor.bankDetails);

  // Vendor's Products, Orders & Store Vouchers
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
  const vendorOrders = orders.filter((o) =>
    o.items.some((item) => item.vendorId === vendor.id)
  );
  const vendorCoupons = coupons.filter((c) => c.vendorId === vendor.id);

  // Vendor's Payout Requests
  const vendorPayouts = payoutRequests.filter((p) => p.vendorId === vendor.id);

  // Financial Calculations: Vendor ONLY receives money after delivery is Complete ('Delivered')!
  const deliveredOrders = vendorOrders.filter((o) => o.status === 'Delivered');
  const pendingDeliveryOrders = vendorOrders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Shipped' || o.status === 'Pending' || o.status === 'Pending Verification'
  );

  const grossSales = deliveredOrders.reduce((sum, order) => {
    const vendorItems = order.items.filter((i) => i.vendorId === vendor.id);
    const orderVendorTotal = vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
    return sum + orderVendorTotal;
  }, 0);

  const escrowPendingAmount = pendingDeliveryOrders.reduce((sum, order) => {
    const vendorItems = order.items.filter((i) => i.vendorId === vendor.id);
    const orderVendorTotal = vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
    return sum + orderVendorTotal;
  }, 0);

  const commissionFee = Math.round((grossSales * (vendor.commissionRate || 5)) / 100);
  const netEarnings = grossSales - commissionFee;

  const approvedPayoutsSum = vendorPayouts
    .filter((p) => p.status === 'Approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBalance = Math.max(0, netEarnings - approvedPayoutsSum);

  const handleDownloadReport = () => {
    alert(
      `Business Analytics Report for ${vendor.name}\n\nGross Sales: BDT ${grossSales.toLocaleString()}\nNet Payout: BDT ${netEarnings.toLocaleString()}\nWithdrawn Payouts: BDT ${approvedPayoutsSum.toLocaleString()}\nAvailable Balance: BDT ${availableBalance.toLocaleString()}`
    );
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateVendorProfile(vendor.id, {
      name: storeName,
      ownerName,
      logo: logoUrl,
      banner: bannerUrl,
      phone,
      address,
      bankDetails,
    });
    setIsEditProfileOpen(false);
    alert('Store profile, logo, and banner updated successfully!');
  };

  const handleCreateStoreVoucher = (e) => {
    e.preventDefault();
    if (!vCode || !vAmount) return;

    const res = addVendorVoucher(vendor.id, vendor.name, {
      code: vCode,
      discountType: vDiscountType,
      amount: vAmount,
      minSpend: vMinSpend,
      description: vDescription || `${vAmount}${vDiscountType === 'percent' ? '% OFF' : ' BDT OFF'} ${vendor.name} Voucher`,
    });

    if (res.success) {
      alert(res.message);
      setIsAddVoucherOpen(false);
      setVCode('');
      setVAmount('10');
      setVMinSpend('500');
      setVDescription('');
    }
  };

  const handleApplyPayoutSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(payoutAmount);

    if (amountNum < 500) {
      setPayoutMessage('Minimum payout amount requirement is BDT 500.');
      return;
    }
    if (amountNum > availableBalance) {
      setPayoutMessage(`Requested amount exceeds available balance of BDT ${availableBalance.toLocaleString()}.`);
      return;
    }

    const res = requestVendorPayout(vendor.id, vendor.name, amountNum, payoutBankDetails || vendor.bankDetails);
    if (res.success) {
      alert(res.message);
      setIsPayoutModalOpen(false);
      setPayoutAmount('500');
      setPayoutMessage('');
    } else {
      setPayoutMessage(res.message);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color-light)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={vendor.logo}
            alt={vendor.name}
            style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{vendor.name}</h1>
              <span className={`badge badge-${vendor.status.toLowerCase()}`}>{vendor.status} Seller</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Owner: {vendor.ownerName} | Trade License: {vendor.tradeLicense} | Payout Account: {vendor.bankDetails}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddVoucherOpen(true)}>
            <Tag size={16} style={{ color: 'var(--accent-blue)' }} /> + Store Voucher
          </button>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setIsEditProfileOpen(true)}>
            <Edit3 size={16} /> Edit Profile & Logo
          </button>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={handleDownloadReport}>
            <FileSpreadsheet size={16} /> Sales Report
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {vendor.status !== 'Approved' && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#92400e',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <ShieldAlert size={20} />
          <span>
            Your store account is currently <strong>{vendor.status}</strong>. Please switch to the <strong>Administrator</strong> view to activate your store!
          </span>
        </div>
      )}

      {/* Store Sales Analytics & Visual Charts Console */}
      <VendorAnalyticsConsole vendor={vendor} />

      {/* KPI Financial Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Delivered Gross Sales</span>
            <DollarSign size={20} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
            BDT {grossSales.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            From {deliveredOrders.length} delivered orders
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#b45309', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>Escrow In-Transit</span>
            <Clock size={20} style={{ color: '#b45309' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', marginTop: '0.4rem' }}>
            BDT {escrowPendingAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Released upon Delivery completion
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Total Net Earnings</span>
            <CheckCircle2 size={20} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '0.5rem' }}>
            BDT {netEarnings.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            After {vendor.commissionRate}% platform fee (BDT {commissionFee.toLocaleString()})
          </div>
        </div>

        <div className="card" style={{ border: '2px solid var(--accent-emerald)', background: '#f0fdf4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#15803d', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>Available Balance for Payout</span>
            <CreditCard size={20} style={{ color: '#15803d' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', marginTop: '0.4rem' }}>
            BDT {availableBalance.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Min BDT 500 required to request payout
          </div>

          <button
            className="btn btn-success"
            style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.45rem' }}
            disabled={availableBalance < 500}
            onClick={() => {
              setPayoutAmount(Math.min(availableBalance, 1000).toString());
              setPayoutBankDetails(vendor.bankDetails);
              setIsPayoutModalOpen(true);
            }}
          >
            <ArrowUpRight size={16} /> {availableBalance >= 500 ? 'Apply for Payout' : 'Min BDT 500 Required'}
          </button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Active Store Vouchers</span>
            <Tag size={20} style={{ color: 'var(--accent-purple)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
            {vendorCoupons.length} Vouchers
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginTop: '0.2rem', fontWeight: 600 }}>
            For {vendor.name} buyers
          </div>
        </div>
      </div>

      {/* Store Vouchers Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} style={{ color: 'var(--accent-blue)' }} />
            Store-Specific Vouchers & Discount Coupons ({vendorCoupons.length})
          </h2>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddVoucherOpen(true)}>
            + Create Store Voucher
          </button>
        </div>

        {vendorCoupons.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <Tag size={38} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }} />
            <h4 style={{ color: 'var(--text-main)' }}>No store vouchers created yet</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Create exclusive discount vouchers to boost your store sales!
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voucher Code</th>
                  <th>Discount Amount</th>
                  <th>Minimum Spend</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorCoupons.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <span className="badge badge-approved" style={{ fontWeight: 800 }}>
                        🎟️ {c.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>
                      {c.discountType === 'percent' ? `${c.amount}% OFF` : `BDT ${c.amount} OFF`}
                    </td>
                    <td>BDT {c.minSpend.toLocaleString()}</td>
                    <td>{c.description}</td>
                    <td>
                      <button
                        onClick={() => deleteVoucher(c.code)}
                        style={{ color: 'var(--accent-rose)', padding: '0.35rem' }}
                        title="Delete Store Voucher"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout History Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Vendor Payout History & Requests ({vendorPayouts.length})
          </h2>
          <button
            className="btn btn-outline"
            style={{ fontSize: '0.8rem' }}
            disabled={availableBalance < 500}
            onClick={() => setIsPayoutModalOpen(true)}
          >
            + Apply New Payout
          </button>
        </div>

        {vendorPayouts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <CreditCard size={38} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }} />
            <h4 style={{ color: 'var(--text-main)' }}>No payout requests submitted yet</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Request Date</th>
                  <th>Amount Requested</th>
                  <th>Payout Channel</th>
                  <th>Status & Transfer TrxID</th>
                </tr>
              </thead>
              <tbody>
                {vendorPayouts.map((pay) => (
                  <tr key={pay.id}>
                    <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>#{pay.id}</td>
                    <td>{pay.date}</td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>BDT {pay.amount.toLocaleString()}</td>
                    <td>{pay.bankDetails}</td>
                    <td>
                      <span className={`badge badge-${pay.status === 'Approved' ? 'approved' : pay.status === 'Rejected' ? 'cancelled' : 'pending'}`}>
                        {pay.status === 'Approved' ? 'Verified & Released' : pay.status}
                      </span>
                      {pay.status === 'Approved' && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: 700, marginTop: 2 }}>
                          Ref TrxID: {pay.transferRef || 'TRX-RELEASED'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vendor Order Processing Desk */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Vendor Order Review & Fulfillment Desk
        </h2>

        {vendorOrders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <ShoppingBag size={44} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }} />
            <h4>No customer orders received yet</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Info</th>
                  <th>Items Ordered</th>
                  <th>Payment Status</th>
                  <th>Current Status</th>
                  <th>Vendor Review Action</th>
                </tr>
              </thead>
              <tbody>
                {vendorOrders.map((order) => {
                  const vendorItems = order.items.filter((i) => i.vendorId === vendor.id);

                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.shippingAddress}</div>
                      </td>
                      <td>
                        {vendorItems.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem' }}>
                            {item.quantity}× {item.title} (BDT {item.price.toLocaleString()})
                          </div>
                        ))}
                      </td>
                      <td>
                        <span className={`badge badge-${order.paymentStatus.toLowerCase().replace(' ', '-')}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span>
                      </td>
                      <td>
                        {order.status === 'Confirmed' || order.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                              onClick={() => vendorProcessOrder(order.id, 'accept', 'Vendor accepted & packed product. Requesting shipment.')}
                            >
                              <Box size={14} /> Accept & Pack Product
                            </button>

                            <button
                              className="btn btn-danger"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                              onClick={() => vendorProcessOrder(order.id, 'reject', 'Vendor out of stock. Order cancelled & customer refunded.')}
                            >
                              <XCircle size={14} /> Reject & Refund
                            </button>
                          </div>
                        ) : order.status === 'Processing' ? (
                          <div style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: 700 }}>
                            <Truck size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Shipment Requested (Awaiting Courier)
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Order Processed ({order.status})
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Catalog Management */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Store Catalog & Stock Management ({vendorProducts.length})
          </h2>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddModalOpen(true)}>
            + Add Product
          </button>
        </div>

        {vendorProducts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Package size={44} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }} />
            <h4>No products listed in your store yet</h4>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setIsAddModalOpen(true)}>
              List First Product
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{ width: 44, height: 44, borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{product.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brand: {product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-shipped">{product.category}</span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>BDT {product.price.toLocaleString()}</td>
                    <td>
                      {product.stock <= 5 ? (
                        <span className="badge badge-pending">
                          Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="badge badge-approved">{product.stock} units</span>
                      )}
                    </td>
                    <td>★ {product.rating} ({product.reviewCount})</td>
                    <td>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        style={{ color: 'var(--accent-rose)', padding: '0.4rem' }}
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Store Voucher Modal */}
      {isAddVoucherOpen && (
        <div className="modal-overlay" onClick={() => setIsAddVoucherOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Store Discount Voucher</h3>
              <button className="close-btn" onClick={() => setIsAddVoucherOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStoreVoucher}>
              <div className="form-group">
                <label className="form-label">Store Voucher Code * (e.g. TECHLAND10)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. TECHLAND10"
                  style={{ textTransform: 'uppercase' }}
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select
                    className="form-select"
                    value={vDiscountType}
                    onChange={(e) => setVDiscountType(e.target.value)}
                  >
                    <option value="percent">Percentage (%) OFF</option>
                    <option value="flat">Flat Amount (BDT) OFF</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Amount *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    placeholder="10 or 200"
                    value={vAmount}
                    onChange={(e) => setVAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Order Spend (BDT)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="500"
                  value={vMinSpend}
                  onChange={(e) => setVMinSpend(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Offer Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Exclusive deal for ${vendor.name} buyers`}
                  value={vDescription}
                  onChange={(e) => setVDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddVoucherOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Store Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply for Payout Modal */}
      {isPayoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPayoutModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Apply for Vendor Payout</h3>
              <button className="close-btn" onClick={() => setIsPayoutModalOpen(false)}>
                ✕
              </button>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Available Balance:</div>
              <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#15803d' }}>
                BDT {availableBalance.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                * Minimum payout threshold: BDT 500
              </div>
            </div>

            {payoutMessage && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 600 }}>
                ⚠️ {payoutMessage}
              </div>
            )}

            <form onSubmit={handleApplyPayoutSubmit}>
              <div className="form-group">
                <label className="form-label">Payout Amount (BDT) * (Min BDT 500)</label>
                <input
                  type="number"
                  min="500"
                  max={availableBalance}
                  className="form-input"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">bKash Merchant / Bank Transfer Account *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="bKash Merchant: 01700... | DBBL A/C 19283"
                  value={payoutBankDetails}
                  onChange={(e) => setPayoutBankDetails(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsPayoutModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Profile Modal */}
      {isEditProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Store Profile & Logo</h3>
              <button className="close-btn" onClick={() => setIsEditProfileOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Store / Business Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Store Logo Image (Direct File Upload) *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {logoUrl && (
                    <img src={logoUrl} alt="Logo Preview" style={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={handleLogoFileChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Store Banner Cover Image (Direct File Upload)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {bannerUrl && (
                    <img src={bannerUrl} alt="Banner Preview" style={{ width: '100%', height: 75, borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={handleBannerFileChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Store Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">bKash Merchant / Bank Details</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditProfileOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Store Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
