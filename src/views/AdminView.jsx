import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Store,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  CreditCard,
  Ban,
  UserPlus,
  ArrowUpRight,
  Tag,
  Plus,
  Trash2,
  Truck,
  UserCheck,
  CheckSquare,
} from 'lucide-react';

import { AdminAnalyticsConsole } from '../components/AdminAnalyticsConsole';

export const AdminView = () => {
  const {
    vendors,
    products,
    orders,
    coupons,
    addPublicVoucher,
    deleteVoucher,
    payoutRequests,
    processVendorPayout,
    approveVendor,
    suspendVendor,
    verifyMFSOrder,
    deliveryAgents,
    approveDeliveryAgent,
    suspendDeliveryAgent,
  } = useApp();

  const [activeTab, setActiveTab] = useState('mfs');
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);

  // Admin Verification & Payout Release Modal State
  const [selectedPayoutVerify, setSelectedPayoutVerify] = useState(null);
  const [payoutTrxId, setPayoutTrxId] = useState('');
  const [payoutNote, setPayoutNote] = useState('');

  // Admin Account Creation State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [adminList, setAdminList] = useState([
    { email: 'admin1234@gmail.com', name: 'Super Administrator', date: '2026-08-01' },
  ]);

  // Public Voucher Creation State
  const [vCode, setVCode] = useState('');
  const [vDiscountType, setVDiscountType] = useState('percent');
  const [vAmount, setVAmount] = useState('10');
  const [vMinSpend, setVMinSpend] = useState('1000');
  const [vDescription, setVDescription] = useState('');

  const mfsOrders = orders.filter((o) => o.status === 'Pending Verification' || o.paymentStatus === 'Pending Verification');
  const pendingVendors = vendors.filter((v) => v.status === 'Pending');
  const pendingPayouts = payoutRequests.filter((p) => p.status === 'Pending Admin Approval');
  const pendingDeliveryAgents = deliveryAgents.filter((d) => d.status === 'Pending');

  const publicCoupons = coupons.filter((c) => c.scope !== 'vendor');

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCommission = Math.round(totalGMV * 0.06);

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminPass) return;

    setAdminList((prev) => [
      ...prev,
      { email: newAdminEmail, name: newAdminName || newAdminEmail.split('@')[0], date: new Date().toISOString().split('T')[0] },
    ]);

    alert(`New Administrator ${newAdminEmail} created successfully!`);
    setIsAddAdminOpen(false);
    setNewAdminEmail('');
    setNewAdminPass('');
    setNewAdminName('');
  };

  const handleCreatePublicVoucher = (e) => {
    e.preventDefault();
    if (!vCode || !vAmount) return;

    const res = addPublicVoucher({
      code: vCode,
      discountType: vDiscountType,
      amount: vAmount,
      minSpend: vMinSpend,
      description: vDescription || `${vAmount}${vDiscountType === 'percent' ? '% OFF' : ' BDT OFF'} Platform Discount`,
    });

    if (res.success) {
      alert(res.message);
      setIsAddVoucherOpen(false);
      setVCode('');
      setVAmount('10');
      setVMinSpend('1000');
      setVDescription('');
    }
  };

  const handleConfirmPayoutRelease = (e) => {
    e.preventDefault();
    if (!selectedPayoutVerify) return;

    processVendorPayout(selectedPayoutVerify.id, true, payoutTrxId, payoutNote);
    alert(
      `Payment verified & released for ${selectedPayoutVerify.vendorName}!\nBDT ${selectedPayoutVerify.amount.toLocaleString()} has been cut from their net seller payout.`
    );
    setSelectedPayoutVerify(null);
    setPayoutTrxId('');
    setPayoutNote('');
  };

  return (
    <div>
      {/* Executive Header */}
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
          <img src="/kinbo-logo.png" alt="Kinbo Logo" style={{ height: 42 }} />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Kinbo System Administrator Control Panel
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Super Admin: admin1234@gmail.com | Vendor Payout Verification & Money Release Console
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddVoucherOpen(true)}>
            <Tag size={16} style={{ color: 'var(--accent-blue)' }} /> + Add Public Voucher
          </button>
          <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddAdminOpen(true)}>
            <UserPlus size={16} /> Add New Admin
          </button>
        </div>
      </div>

      {/* Metric Cards */}
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
            <span>Pending Payout Requests</span>
            <ArrowUpRight size={20} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: pendingPayouts.length > 0 ? 'var(--accent-emerald)' : 'var(--text-main)', marginTop: '0.5rem' }}>
            {pendingPayouts.length} Requests
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Requires Payment Verification
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>MFS Verifications Pending</span>
            <CreditCard size={20} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: mfsOrders.length > 0 ? 'var(--accent-rose)' : 'var(--text-main)', marginTop: '0.5rem' }}>
            {mfsOrders.length} TrxIDs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            bKash / Nagad Admin Verification
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Pending Delivery Riders</span>
            <Truck size={20} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: pendingDeliveryAgents.length > 0 ? 'var(--accent-blue)' : 'var(--text-main)', marginTop: '0.5rem' }}>
            {pendingDeliveryAgents.length} Riders
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Awaiting Admin Approval
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Marketplace GMV</span>
            <DollarSign size={20} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
            BDT {totalGMV.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Gross Merchandise Value
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} /> Sales Analytics & Charts 📊
        </button>

        <button
          className={`btn ${activeTab === 'payouts' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('payouts')}
        >
          <ArrowUpRight size={16} /> Vendor Payouts Verification ({payoutRequests.length})
        </button>

        <button
          className={`btn ${activeTab === 'mfs' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('mfs')}
        >
          <CreditCard size={16} /> MFS TrxID Verification ({mfsOrders.length})
        </button>

        <button
          className={`btn ${activeTab === 'delivery' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('delivery')}
        >
          <Truck size={16} /> Delivery Rider Approvals ({deliveryAgents.length})
        </button>

        <button
          className={`btn ${activeTab === 'vouchers' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('vouchers')}
        >
          <Tag size={16} /> Public Platform Vouchers ({publicCoupons.length})
        </button>

        <button
          className={`btn ${activeTab === 'vendors' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('vendors')}
        >
          <Store size={16} /> User & Vendor Management ({vendors.length})
        </button>

        <button
          className={`btn ${activeTab === 'admins' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('admins')}
        >
          <ShieldCheck size={16} /> Admin Accounts ({adminList.length})
        </button>
      </div>

      {/* Sales Analytics & Visual Charts Console */}
      {activeTab === 'analytics' && <AdminAnalyticsConsole />}

      {/* Module 1: Vendor Payouts Console & Verification */}
      {activeTab === 'payouts' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpRight size={18} style={{ color: 'var(--accent-emerald)' }} />
            Vendor Seller Payout Verification & Money Release Desk
          </h3>

          {payoutRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <CheckCircle2 size={44} style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }} />
              <h4 style={{ color: 'var(--text-main)' }}>No Vendor Payout Requests</h4>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payout ID</th>
                    <th>Vendor Store</th>
                    <th>Amount Requested</th>
                    <th>Payout Account Details</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    <th>Admin Verification & Money Release</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutRequests.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>#{p.id}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.vendorName}</td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>BDT {p.amount.toLocaleString()}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.bankDetails}</div>
                      </td>
                      <td>{p.date}</td>
                      <td>
                        <span className={`badge badge-${p.status === 'Approved' ? 'approved' : p.status === 'Rejected' ? 'cancelled' : 'pending'}`}>
                          {p.status === 'Approved' ? 'Verified & Released' : p.status}
                        </span>
                      </td>
                      <td>
                        {p.status === 'Pending Admin Approval' ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                              onClick={() => {
                                setSelectedPayoutVerify(p);
                                setPayoutTrxId(`TRX-${Math.floor(100000 + Math.random() * 900000)}`);
                                setPayoutNote('Admin verified bKash merchant payout transfer.');
                              }}
                            >
                              <CheckSquare size={14} /> Verify & Release Money
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                              onClick={() => processVendorPayout(p.id, false, '', 'Rejected by Admin')}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 800 }}>
                              ✓ Money Released (Deducted from Seller Payout)
                            </div>
                            {p.transferRef && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: 700, marginTop: 2 }}>
                                Ref TrxID: {p.transferRef}
                              </div>
                            )}
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
      )}

      {/* Module 2: MFS Verification */}
      {activeTab === 'mfs' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} style={{ color: 'var(--accent-blue)' }} />
            Manual MFS (bKash/Nagad) Payment Verification Console
          </h3>

          {mfsOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <CheckCircle2 size={44} style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }} />
              <h4 style={{ color: 'var(--text-main)' }}>All MFS Transactions Verified!</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                There are no pending bKash or Nagad transactions requiring verification right now.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>MFS Channel & TrxID</th>
                    <th>Payable Amount</th>
                    <th>Date & Time</th>
                    <th>Admin Verification Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {mfsOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                      </td>
                      <td>
                        <span className="badge badge-pending" style={{ background: '#fce7f3', color: '#be185d' }}>
                          {order.paymentMethod}
                        </span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: 2 }}>
                          TrxID: {order.paymentTrxId}
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>BDT {order.total.toLocaleString()}</td>
                      <td>{order.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-success"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                            onClick={() => verifyMFSOrder(order.id, true, 'Admin verified MFS Merchant Account transaction.')}
                          >
                            <CheckCircle2 size={14} /> Confirm Payment
                          </button>

                          <button
                            className="btn btn-danger"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                            onClick={() => verifyMFSOrder(order.id, false, 'Admin rejected TrxID as invalid transaction.')}
                          >
                            <XCircle size={14} /> Invalid Transaction
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Module 3: Delivery Agents Console */}
      {activeTab === 'delivery' && (
        <div>
          {pendingDeliveryAgents.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b45309', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Pending Delivery Rider Applications ({pendingDeliveryAgents.length})
              </h3>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rider Name</th>
                      <th>Contact Info</th>
                      <th>Vehicle & License</th>
                      <th>NID Card Number</th>
                      <th>Operating Zone & bKash</th>
                      <th>Approval Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDeliveryAgents.map((d) => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.name}</td>
                        <td>
                          <div>{d.phone}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.email}</div>
                        </td>
                        <td>
                          <span className="badge badge-shipped">{d.vehicle}</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {d.license || 'DL/2026/KINBO'}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{d.nid}</td>
                        <td>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.zone || 'Dhaka North'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                            bKash: {d.bkash || d.phone}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                              onClick={() => {
                                approveDeliveryAgent(d.id);
                                alert(`✓ Delivery Rider "${d.name}" APPROVED successfully!\nAccount activated for Logistics Dashboard access.`);
                              }}
                            >
                              <CheckCircle2 size={14} /> Approve Rider
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                              onClick={() => suspendDeliveryAgent(d.id)}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={18} style={{ color: 'var(--accent-blue)' }} />
            Active Delivery Agents Directory ({deliveryAgents.length})
          </h3>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rider Name</th>
                  <th>Vehicle & License</th>
                  <th>NID Card Number</th>
                  <th>Zone & bKash Payout</th>
                  <th>Deliveries</th>
                  <th>Rating</th>
                  <th>Approval Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveryAgents.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.name}</td>
                    <td>
                      <span className="badge badge-shipped">{d.vehicle}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{d.license || 'DL/2026/DHAKA'}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{d.nid}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.zone || 'Dhaka North'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                        bKash: {d.bkash || d.phone}
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{d.completedDeliveries} Trips</td>
                    <td>★ {d.rating}</td>
                    <td>
                      <span className={`badge badge-${d.status.toLowerCase()}`}>{d.status}</span>
                    </td>
                    <td>
                      {d.status === 'Approved' ? (
                        <button
                          className="btn btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: 'var(--accent-rose)' }}
                          onClick={() => suspendDeliveryAgent(d.id)}
                        >
                          <Ban size={12} /> Suspend Rider
                        </button>
                      ) : (
                        <button
                          className="btn btn-success"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => {
                            approveDeliveryAgent(d.id);
                            alert(`✓ Delivery Rider "${d.name}" APPROVED successfully!\nAccount activated for Logistics Dashboard access.`);
                          }}
                        >
                          Approve Rider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 4: Admin Public Vouchers Console */}
      {activeTab === 'vouchers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={18} style={{ color: 'var(--accent-blue)' }} />
              Public Platform Vouchers Directory ({publicCoupons.length})
            </h3>

            <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddVoucherOpen(true)}>
              + Create New Public Voucher
            </button>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voucher Code</th>
                  <th>Discount Details</th>
                  <th>Minimum Spend</th>
                  <th>Scope / Provider</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {publicCoupons.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <span className="badge badge-approved" style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                        🎟️ {c.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>
                      {c.discountType === 'percent' ? `${c.amount}% OFF` : `BDT ${c.amount} Flat OFF`}
                    </td>
                    <td>BDT {c.minSpend.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-pending">Platform Public</span>
                    </td>
                    <td>{c.description}</td>
                    <td>
                      <button
                        onClick={() => deleteVoucher(c.code)}
                        style={{ color: 'var(--accent-rose)', padding: '0.35rem' }}
                        title="Delete Voucher"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 5: User & Vendor Management */}
      {activeTab === 'vendors' && (
        <div>
          {pendingVendors.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b45309', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Pending Seller Registration Queue ({pendingVendors.length})
              </h3>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Store & Owner Name</th>
                      <th>Category</th>
                      <th>Contact Email / Phone</th>
                      <th>Trade License / Bank Details</th>
                      <th>Registration Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVendors.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{v.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Owner: {v.ownerName}</div>
                        </td>
                        <td>
                          <span className="badge badge-pending">{v.category}</span>
                        </td>
                        <td>
                          <div>{v.email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600 }}>{v.tradeLicense}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.bankDetails}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                              onClick={() => approveVendor(v.id)}
                            >
                              <CheckCircle2 size={14} /> Approve & Activate Store
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                              onClick={() => suspendVendor(v.id)}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Registered Vendor Stores Directory
          </h3>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor Store</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Commission Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={v.logo} alt={v.name} style={{ width: 36, height: 36, borderRadius: '6px', objectFit: 'cover' }} />
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{v.name}</div>
                      </div>
                    </td>
                    <td>{v.ownerName}</td>
                    <td>{v.category}</td>
                    <td>{v.commissionRate}% Fee</td>
                    <td>
                      <span className={`badge badge-${v.status.toLowerCase()}`}>{v.status}</span>
                    </td>
                    <td>
                      {v.status === 'Approved' ? (
                        <button
                          className="btn btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: 'var(--accent-rose)' }}
                          onClick={() => suspendVendor(v.id)}
                        >
                          <Ban size={12} /> Suspend Store
                        </button>
                      ) : (
                        <button
                          className="btn btn-success"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => approveVendor(v.id)}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 6: Admin Accounts */}
      {activeTab === 'admins' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Authorized System Administrator Accounts ({adminList.length})
            </h3>
            <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddAdminOpen(true)}>
              + Add New Admin
            </button>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Admin Name</th>
                  <th>Gmail / Email</th>
                  <th>Access Role</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                {adminList.map((a, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{a.name}</td>
                    <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{a.email}</td>
                    <td>
                      <span className="badge badge-approved">Super Admin</span>
                    </td>
                    <td>{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verify & Release Payout Modal */}
      {selectedPayoutVerify && (
        <div className="modal-overlay" onClick={() => setSelectedPayoutVerify(null)}>
          <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Verify & Release Vendor Payout</h3>
              <button className="close-btn" onClick={() => setSelectedPayoutVerify(null)}>
                ✕
              </button>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Vendor Payout Target:</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                {selectedPayoutVerify.vendorName}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#15803d', marginTop: '0.3rem' }}>
                BDT {selectedPayoutVerify.amount.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Payout Destination: <strong>{selectedPayoutVerify.bankDetails}</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmPayoutRelease}>
              <div className="form-group">
                <label className="form-label">Payment Transfer TrxID / Reference No. *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. bKash TrxID: 9X82A71K / DBBL-TRX-10293"
                  value={payoutTrxId}
                  onChange={(e) => setPayoutTrxId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Verification Note</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Money transferred via bKash Merchant Wallet"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                />
              </div>

              <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', color: '#c2410c', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
                ⚡ Confirming this will mark the payout as <strong>Verified & Released</strong> and cut <strong>BDT {selectedPayoutVerify.amount.toLocaleString()}</strong> from the vendor's available balance!
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSelectedPayoutVerify(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <CheckSquare size={16} /> Confirm & Release Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Public Voucher Modal */}
      {isAddVoucherOpen && (
        <div className="modal-overlay" onClick={() => setIsAddVoucherOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Public Platform Voucher</h3>
              <button className="close-btn" onClick={() => setIsAddVoucherOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePublicVoucher}>
              <div className="form-group">
                <label className="form-label">Voucher Code * (e.g. EID2026, KINBO500)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="EID2026"
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
                    placeholder="15 or 300"
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
                  placeholder="1000"
                  value={vMinSpend}
                  onChange={(e) => setVMinSpend(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Offer Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 15% OFF for Eid Shopping Mega Deal"
                  value={vDescription}
                  onChange={(e) => setVDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddVoucherOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Public Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Admin Modal */}
      {isAddAdminOpen && (
        <div className="modal-overlay" onClick={() => setIsAddAdminOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New System Admin Account</h3>
              <button className="close-btn" onClick={() => setIsAddAdminOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin}>
              <div className="form-group">
                <label className="form-label">Admin Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Operations Admin"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Gmail / Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="newadmin@gmail.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddAdminOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
