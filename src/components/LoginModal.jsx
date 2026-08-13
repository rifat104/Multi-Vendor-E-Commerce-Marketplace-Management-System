import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, ArrowRight, Store, Truck, UserCheck, Eye, EyeOff } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login, registerUser, registerDeliveryAgent } = useApp();

  const [isRegister, setIsRegister] = useState(false);

  // Login State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Base State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Vendor Application State
  const [isVendorReg, setIsVendorReg] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [tradeLicense, setTradeLicense] = useState('');
  const [bankDetails, setBankDetails] = useState('');

  // Delivery Application State
  const [isDeliveryReg, setIsDeliveryReg] = useState(false);
  const [address, setAddress] = useState('');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [nidNumber, setNidNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('Dhaka North (Uttara / Mirpur)');
  const [riderBkash, setRiderBkash] = useState('');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmailOrPhone || !loginPassword) {
      setError('Please enter both email/phone and password.');
      return;
    }

    const res = login(loginEmailOrPhone, loginPassword);
    if (!res || !res.success) {
      setError(res?.message || 'Invalid Email/Phone or Password. Please check your credentials.');
      return;
    }

    setError('');
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (isVendorReg && !storeName) {
      setError('Please enter your Shop / Store Name.');
      return;
    }

    if (isDeliveryReg && !nidNumber) {
      setError('Please enter your NID Card Number for rider verification.');
      return;
    }

    registerUser({
      name,
      phone,
      email,
      password,
      isVendor: isVendorReg,
      storeName,
      category,
      tradeLicense,
      bankDetails,
      isDelivery: isDeliveryReg,
      address,
      vehicleType,
    });

    if (isDeliveryReg) {
      registerDeliveryAgent({
        name,
        phone,
        email,
        vehicle: vehicleType,
        nid: nidNumber || '199' + Math.floor(10000000 + Math.random() * 90000000),
        license: vehicleType === 'Bicycle' ? 'Not Required (Bicycle)' : (licenseNumber || 'DL/2026/KINBO'),
        zone: deliveryZone,
        bkash: riderBkash || phone,
      });
    }

    setError('');
    onClose();
    if (isVendorReg || isDeliveryReg) {
      alert(
        'Registration successful! Your application is pending Admin approval. You will see your request on the Admin Dashboard under Pending Approvals!'
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src="/kinbo-logo.png" alt="Kinbo" style={{ height: 38 }} />
            <h3 className="modal-title">{isRegister ? 'Create Kinbo Account' : 'Login to Kinbo'}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {!isRegister ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address or Phone Number *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="example123@gmail.com"
                value={loginEmailOrPhone}
                onChange={(e) => setLoginEmailOrPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
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
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Sign In to Account <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                style={{ color: 'var(--accent-blue)', fontWeight: 800, textDecoration: 'underline' }}
              >
                Register Now
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="+8801700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="example123@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Create Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
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
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Checkboxes */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--border-color-light)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                Optional Seller or Delivery Rider Registrations:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isVendorReg}
                    onChange={(e) => {
                      setIsVendorReg(e.target.checked);
                      if (e.target.checked) setIsDeliveryReg(false);
                    }}
                  />
                  <Store size={16} style={{ color: 'var(--accent-blue)' }} /> Register as Vendor / Seller (Sell on Kinbo)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isDeliveryReg}
                    onChange={(e) => {
                      setIsDeliveryReg(e.target.checked);
                      if (e.target.checked) setIsVendorReg(false);
                    }}
                  />
                  <Truck size={16} style={{ color: 'var(--accent-blue)' }} /> Register as Delivery Courier Rider
                </label>
              </div>
            </div>

            {/* Vendor Details */}
            {isVendorReg && (
              <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--accent-blue-light)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                  Shop & Business Details (Pending Admin Approval):
                </div>

                <div className="form-group">
                  <label className="form-label">Shop / Store Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bengal Tech Hub"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Primary Category</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                      <option value="Fashion & Clothing">Fashion & Clothing</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trade License</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="TRAD/2026/0192"
                      value={tradeLicense}
                      onChange={(e) => setTradeLicense(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">bKash Merchant / Bank Details</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="bKash Merchant: 01700... | DBBL A/C 1920"
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Delivery Rider Full Details */}
            {isDeliveryReg && (
              <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--accent-blue-light)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                  Delivery Rider Complete Profile (Pending Admin Approval):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Type *</label>
                    <select className="form-select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Bicycle">Bicycle (No License Needed)</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Delivery Van">Delivery Van</option>
                    </select>
                  </div>

                  {vehicleType !== 'Bicycle' ? (
                    <div className="form-group">
                      <label className="form-label">Driving License / Vehicle Reg No</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="DL/2026/DHAKA"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Driving License / Reg No</label>
                      <div
                        style={{
                          background: '#e2e8f0',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          marginTop: 2,
                        }}
                      >
                        🚫 Not Required for Bicycle Delivery
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">NID Card Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="1995839201"
                      value={nidNumber}
                      onChange={(e) => setNidNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Operating Zone</label>
                    <select className="form-select" value={deliveryZone} onChange={(e) => setDeliveryZone(e.target.value)}>
                      <option value="Dhaka North (Uttara / Mirpur / Gulshan)">Dhaka North (Uttara / Mirpur)</option>
                      <option value="Dhaka South (Dhanmondi / Motijheel)">Dhaka South (Dhanmondi / Motijheel)</option>
                      <option value="Chattogram Central">Chattogram Central</option>
                      <option value="Sylhet Metropolitan">Sylhet Metropolitan</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">bKash Payout Account Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="01700000000"
                    value={riderBkash}
                    onChange={(e) => setRiderBkash(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
              Complete Registration & Auto-Login <UserCheck size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                style={{ color: 'var(--accent-blue)', fontWeight: 800, textDecoration: 'underline' }}
              >
                Sign In Instead
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
