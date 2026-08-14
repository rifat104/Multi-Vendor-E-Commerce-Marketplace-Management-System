import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Store, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const VendorRegisterModal = ({ isOpen, onClose }) => {
  const { registerUser } = useApp();

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [tradeLicense, setTradeLicense] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !ownerName || !email || !phone || !password) return;

    await registerUser({
      name: ownerName,
      phone,
      email,
      password,
      isVendor: true,
      storeName: name,
      address,
      category,
      tradeLicense,
      bankDetails,
    });

    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={22} style={{ color: 'var(--accent-blue)' }} />
            <h3 className="modal-title">Vendor Store Registration</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={54} style={{ color: 'var(--accent-emerald)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Application Submitted Successfully!
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your seller application for <strong>{name}</strong> is currently pending Administrator verification. You can log in using <strong>{email}</strong> and your password!
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Close & Return to Marketplace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Store / Business Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Bengal Tech Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Md. Rifat Hossain"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Business Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="contact@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="+8801700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field with Eye Show/Hide Option */}
            <div className="form-group">
              <label className="form-label">Create Vendor Login Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  required
                  placeholder="Set your vendor login password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Store / Warehouse Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="Building, Street, Area, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Primary Business Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option value="Fashion & Clothing">Fashion & Clothing</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  <option value="Groceries & Essentials">Groceries & Essentials</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trade License Number (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="TRAD/DNCC/19203/2026"
                  value={tradeLicense}
                  onChange={(e) => setTradeLicense(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bank or Mobile Banking Details for Payouts</label>
              <input
                type="text"
                className="form-input"
                placeholder="bKash Merchant: 01700... | Bank: City Bank A/C 19283"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Vendor Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
