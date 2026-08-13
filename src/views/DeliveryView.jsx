import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Package,
  XCircle,
  RotateCcw,
  DollarSign,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  LogOut,
  Layers,
  CheckSquare,
} from 'lucide-react';

export const DeliveryView = () => {
  const { orders, currentUser, deliveryAgents, driverProcessDelivery, logout } = useApp();
  const [filterTab, setFilterTab] = useState('all');

  // Match logged in delivery rider account
  const currentRider =
    deliveryAgents.find(
      (d) =>
        d.id === currentUser.id ||
        (currentUser.email && d.email && d.email.toLowerCase() === currentUser.email.toLowerCase())
    ) || {
      name: currentUser.name || 'Approved Rider',
      phone: currentUser.phone || '+8801700000000',
      email: currentUser.email || 'rider@kinbo.com',
      vehicle: currentUser.vehicle || 'Motorcycle',
      nid: '1995839201',
      zone: 'Dhaka North Hub',
      status: 'Approved',
      rating: 5.0,
      completedDeliveries: 15,
    };

  // Show all customer shipments across the platform
  const allShipmentOrders = orders.filter((o) => o.status !== 'Cancelled');

  const filteredOrders = allShipmentOrders.filter((o) => {
    if (filterTab === 'pickup') return o.status === 'Confirmed' || o.status === 'Processing';
    if (filterTab === 'transit') return o.status === 'Shipped';
    if (filterTab === 'delivered') return o.status === 'Delivered';
    return true; // 'all'
  });

  const activeDeliveriesCount = allShipmentOrders.filter((o) => o.status === 'Shipped' || o.status === 'Processing' || o.status === 'Confirmed').length;
  const completedCount = allShipmentOrders.filter((o) => o.status === 'Delivered').length;
  const deliveryFeesEarned = completedCount * 60; // BDT 60 per trip

  return (
    <div>
      {/* Rider Executive Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'white', padding: '0.65rem', borderRadius: '50%', color: '#0284c7', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
              <Truck size={36} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
                  {currentRider.name} — Logistics Dashboard
                </h1>
                <span className="badge badge-approved" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800 }}>
                  ✓ Approved Rider Account
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '0.25rem' }}>
                Vehicle: <strong>{currentRider.vehicle}</strong> | Operating Zone: <strong>{currentRider.zone || 'Dhaka Central Hub'}</strong> | Email: <strong>{currentRider.email}</strong> | Phone: {currentRider.phone}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="btn"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: 700 }}
          >
            <LogOut size={15} /> Log Out to Browse Customer Store
          </button>
        </div>
      </div>

      {/* Mandatory Notice: Dedicated Rider View */}
      <div
        style={{
          background: '#f0f9ff',
          border: '1px solid var(--accent-blue-light)',
          color: '#0369a1',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <ShieldCheck size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
        <span>
          <strong>Dedicated Rider Operations Console:</strong> Public e-commerce products are hidden in delivery mode. You can view all package shipments below and update delivery status live. To browse customer products, click <strong>Log Out</strong>.
        </span>
      </div>

      {/* Rider Performance Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Shipment Tasks</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '0.3rem' }}>
            {activeDeliveriesCount} Packages
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Ready for pickup & doorstep drop
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Deliveries</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', marginTop: '0.3rem' }}>
            {completedCount} Trips
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Successfully delivered packages
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Delivery Commission Earned</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', marginTop: '0.3rem' }}>
            BDT {deliveryFeesEarned.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            BDT 60 per completed delivery
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rider Account Status</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', marginTop: '0.3rem' }}>
            Active / ★ {currentRider.rating || 5.0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Approved by System Administrator
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={20} style={{ color: 'var(--accent-blue)' }} /> Assigned Package Shipment Queue ({filteredOrders.length})
        </h2>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${filterTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            onClick={() => setFilterTab('all')}
          >
            All Packages ({allShipmentOrders.length})
          </button>
          <button
            className={`btn ${filterTab === 'pickup' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            onClick={() => setFilterTab('pickup')}
          >
            Ready for Pickup ({allShipmentOrders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing').length})
          </button>
          <button
            className={`btn ${filterTab === 'transit' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            onClick={() => setFilterTab('transit')}
          >
            Out for Delivery ({allShipmentOrders.filter((o) => o.status === 'Shipped').length})
          </button>
          <button
            className={`btn ${filterTab === 'delivered' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            onClick={() => setFilterTab('delivered')}
          >
            Delivered ({completedCount})
          </button>
        </div>
      </div>

      {/* Shipment Queue Items Grid */}
      {filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Package size={48} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }} />
          <h4 style={{ color: 'var(--text-main)' }}>No shipments found under this status</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Select "All Packages" to view all active customer shipments in the system.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredOrders.map((order) => {
            const isCOD = order.paymentMethod === 'Cash on Delivery';
            const isDelivered = order.status === 'Delivered';
            const isFailed = order.status === 'Delivery Failed';

            return (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  border: `1.5px solid ${isDelivered ? '#bbf7d0' : isFailed ? '#fecaca' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-blue)' }}>
                    Order #{order.id}
                  </span>
                  <span className={`badge badge-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem', flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Customer: {order.customerName}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <MapPin size={16} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{order.shippingAddress}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Phone size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{order.customerPhone}</span>
                  </div>
                </div>

                {/* Purchased Items List */}
                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: 2 }}>Package Contents:</div>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      • {item.title} (x{item.quantity}) — BDT {(item.price * item.quantity).toLocaleString()}
                    </div>
                  ))}
                </div>

                {/* Cash Collect Box */}
                <div
                  style={{
                    background: isCOD ? '#fee2e2' : '#dcfce7',
                    border: `1px solid ${isCOD ? '#fecaca' : '#bbf7d0'}`,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Payment Method:</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isCOD ? '#b91c1c' : '#15803d' }}>
                      {order.paymentMethod} {order.paymentTrxId ? `(${order.paymentTrxId})` : ''}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isCOD ? 'Collect Cash Amount:' : 'Prepaid Total:'}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isCOD ? '#b91c1c' : '#15803d' }}>
                      BDT {order.total.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Delivery Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(order.status === 'Confirmed' || order.status === 'Processing') && (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.82rem', padding: '0.55rem' }}
                      onClick={() => {
                        driverProcessDelivery(order.id, 'Shipped');
                        alert(`✓ Package #${order.id} picked up!\nStatus updated to "Shipped / Out for Delivery".`);
                      }}
                    >
                      <Truck size={16} /> Pick Up Package & Start Delivery
                    </button>
                  )}

                  {order.status === 'Shipped' && (
                    <>
                      <button
                        className="btn btn-success"
                        style={{ flex: 1, fontSize: '0.82rem', padding: '0.55rem' }}
                        onClick={() => {
                          driverProcessDelivery(order.id, 'Delivered');
                          alert(`✓ Order #${order.id} marked as DELIVERED!\nVendor payout balance has been credited.`);
                        }}
                      >
                        <CheckCircle2 size={16} /> Mark Delivered
                      </button>

                      <button
                        className="btn btn-danger"
                        style={{ flex: 1, fontSize: '0.82rem', padding: '0.55rem' }}
                        onClick={() => {
                          driverProcessDelivery(order.id, 'Delivery Failed');
                          alert(` Order #${order.id} marked as Delivery Failed.\nCustomer 3 Working Days refund policy initiated.`);
                        }}
                      >
                        <XCircle size={16} /> Delivery Failed
                      </button>
                    </>
                  )}

                  {isDelivered && (
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '0.82rem', color: '#15803d', fontWeight: 800, padding: '0.4rem', background: '#f0fdf4', borderRadius: '4px' }}>
                      ✓ Package Successfully Delivered to Customer
                    </div>
                  )}

                  {isFailed && (
                    <div style={{ width: '100%', textAlign: 'center', fontSize: '0.82rem', color: '#b91c1c', fontWeight: 800, padding: '0.4rem', background: '#fef2f2', borderRadius: '4px' }}>
                      ⚠️ Delivery Failed / Refund Pending (3 Days)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
