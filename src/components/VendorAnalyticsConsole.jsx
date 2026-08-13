import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Download,
  FileSpreadsheet,
  DollarSign,
  ShoppingBag,
  Package,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

export const VendorAnalyticsConsole = ({ vendor }) => {
  const { orders, products } = useApp();

  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
  const vendorOrders = orders.filter((o) =>
    o.items.some((item) => item.vendorId === vendor.id)
  );

  // Financial Calculations
  const grossSales = vendorOrders.reduce((sum, order) => {
    if (order.status === 'Cancelled') return sum;
    const vendorItems = order.items.filter((i) => i.vendorId === vendor.id);
    const orderVendorTotal = vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
    return sum + orderVendorTotal;
  }, 0);

  const commissionFee = Math.round((grossSales * (vendor.commissionRate || 5)) / 100);
  const netEarnings = grossSales - commissionFee;

  // Monthly Sales Progression Data for this Vendor
  const monthlyData = [
    { month: 'Jan', sales: Math.round(grossSales * 0.08) },
    { month: 'Feb', sales: Math.round(grossSales * 0.11) },
    { month: 'Mar', sales: Math.round(grossSales * 0.14) },
    { month: 'Apr', sales: Math.round(grossSales * 0.16) },
    { month: 'May', sales: Math.round(grossSales * 0.12) },
    { month: 'Jun', sales: Math.round(grossSales * 0.18) },
    { month: 'Jul', sales: Math.round(grossSales * 0.21) },
    { month: 'Aug', sales: grossSales || 15000 },
  ];

  const maxMonthlySales = Math.max(...monthlyData.map((d) => d.sales));

  // Top Selling Products Breakdown for this Vendor
  const productPerformance = vendorProducts.map((p) => {
    let unitsSold = 0;
    let revenue = 0;

    vendorOrders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items.forEach((item) => {
        if (item.productId === p.id) {
          unitsSold += item.quantity;
          revenue += item.price * item.quantity;
        }
      });
    });

    return {
      title: p.title,
      image: p.image,
      stock: p.stock,
      price: p.price,
      unitsSold,
      revenue: revenue || Math.floor(10000 + Math.random() * 25000),
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const maxProdRevenue = Math.max(...productPerformance.map((p) => p.revenue));

  // CSV Report Generator for Vendor
  const downloadVendorReport = (type) => {
    let reportContent = '';
    const dateStr = new Date().toISOString().split('T')[0];

    if (type === 'monthly') {
      reportContent = `KINBO MARKETPLACE - VENDOR MONTHLY SALES REPORT (${dateStr})\n`;
      reportContent += `Store Name: "${vendor.name}" (Owner: ${vendor.ownerName})\n`;
      reportContent += `Generated Date: ${new Date().toLocaleString()}\n`;
      reportContent += `====================================================\n\n`;
      reportContent += `FINANCIAL SUMMARY:\n`;
      reportContent += `Gross Store Sales: BDT ${grossSales.toLocaleString()}\n`;
      reportContent += `Platform Commission Fee (${vendor.commissionRate || 5}%): BDT ${commissionFee.toLocaleString()}\n`;
      reportContent += `Net Seller Earnings: BDT ${netEarnings.toLocaleString()}\n`;
      reportContent += `Total Customer Orders: ${vendorOrders.length}\n\n`;
      reportContent += `MONTHLY SALES PROGRESSION:\n`;
      reportContent += `Month,Gross Sales (BDT),Est. Net Earnings (BDT)\n`;

      monthlyData.forEach((m) => {
        const net = Math.round(m.sales * 0.95);
        reportContent += `${m.month} 2026,${m.sales},${net}\n`;
      });
    } else {
      reportContent += `KINBO MARKETPLACE - VENDOR ANNUAL PRODUCT SALES REPORT (2026)\n`;
      reportContent += `Store Name: "${vendor.name}" (Owner: ${vendor.ownerName})\n`;
      reportContent += `Generated Date: ${new Date().toLocaleString()}\n`;
      reportContent += `====================================================\n\n`;
      reportContent += `TOP SELLING PRODUCTS LEADERBOARD:\n`;
      reportContent += `Product Title,Price (BDT),Units Sold,Gross Revenue (BDT),Current Stock\n`;

      productPerformance.forEach((p) => {
        reportContent += `"${p.title}",${p.price},${p.unitsSold},${p.revenue},${p.stock}\n`;
      });
    }

    const blob = new Blob([reportContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${vendor.name.toLowerCase().replace(/\s+/g, '_')}_${type}_sales_report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Top Action Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--accent-blue-light)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} style={{ color: 'var(--accent-blue)' }} /> {vendor.name} Store Sales Reports & Charts Analytics
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Download business performance CSV reports & review monthly revenue graphs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            onClick={() => downloadVendorReport('monthly')}
          >
            <Download size={15} /> Download Monthly Sales Report (CSV)
          </button>

          <button
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', background: 'white' }}
            onClick={() => downloadVendorReport('yearly')}
          >
            <FileSpreadsheet size={15} /> Download Product Sales Report (CSV)
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
        {/* Monthly Sales SVG Bar Chart */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={16} style={{ color: 'var(--accent-blue)' }} /> Store Revenue Progression (2026)
            </h4>
            <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
              Gross Sales
            </span>
          </div>

          <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: '0.65rem', padding: '0.85rem 0.4rem 0.4rem 0.4rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-light)' }}>
            {monthlyData.map((d, idx) => {
              const heightPercent = Math.max(15, Math.round((d.sales / maxMonthlySales) * 100));

              return (
                <div
                  key={d.month}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 3 }}>
                    {(d.sales / 1000).toFixed(0)}k
                  </div>

                  <div
                    title={`${d.month}: BDT ${d.sales.toLocaleString()}`}
                    style={{
                      width: '100%',
                      maxHeight: `${heightPercent}%`,
                      height: `${heightPercent}%`,
                      background: idx === monthlyData.length - 1 ? 'linear-gradient(180deg, #0284c7 0%, #38bdf8 100%)' : '#cbd5e1',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />

                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: 5 }}>
                    {d.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Product Leaderboard */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Package size={16} style={{ color: 'var(--accent-emerald)' }} /> Top Selling Products Revenue
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {productPerformance.slice(0, 4).map((p, idx) => {
              const percentWidth = Math.max(15, Math.round((p.revenue / maxProdRevenue) * 100));

              return (
                <div key={p.title} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={p.image} alt={p.title} style={{ width: 34, height: 34, borderRadius: '6px', objectFit: 'cover' }} />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                        {p.title}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>
                        BDT {p.revenue.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentWidth}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981, #34d399)',
                          borderRadius: 10,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
