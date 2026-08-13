import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COUPONS,
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Registered User Accounts List
  const [userAccounts, setUserAccounts] = useState(() => {
    const saved = localStorage.getItem('kinbo_user_accounts');
    return saved
      ? JSON.parse(saved)
      : [
          { email: 'customer@kinbo.com', password: '123', name: 'Rifat Hossain', phone: '+8801700000000', role: 'customer' },
          { email: 'vendor@techlandbd.com', password: '123', name: 'TechLand BD', ownerName: 'Tanvir Ahmed', role: 'vendor', vendorId: 'v1' },
          { email: 'support@aarongcrafts.com', password: '123', name: 'Aarong Crafts & Apparel', ownerName: 'Nusrat Jahan', role: 'vendor', vendorId: 'v2' },
          { email: 'rifat123@gmail.com', password: 'rifat123', name: 'Rifat Ahmed', phone: '+8801711223344', role: 'delivery' },
        ];
  });

  const [adminAccounts] = useState(() => {
    const saved = localStorage.getItem('kinbo_admin_accounts');
    return saved
      ? JSON.parse(saved)
      : [{ email: 'admin1234@gmail.com', password: 'admin@123', name: 'Super Administrator' }];
  });

  // Current Logged-In User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kinbo_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'c1',
          name: 'Rifat Hossain',
          email: 'customer@kinbo.com',
          phone: '+8801700000000',
          address: 'House 14, Road 5, Block B, Bashundhara R/A, Dhaka',
          role: 'customer',
          isAuthenticated: true,
        };
  });

  const [activeRole, setActiveRole] = useState(() => currentUser.role || 'customer');
  const [activeVendorId, setActiveVendorId] = useState(() => localStorage.getItem('kinbo_vendor_id') || 'v1');

  // Coupon & Voucher State
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('kinbo_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [collectedVouchers, setCollectedVouchers] = useState(() => {
    const saved = localStorage.getItem('kinbo_collected_vouchers');
    return saved ? JSON.parse(saved) : ['KINBO10'];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    return coupons.find((c) => c.code === 'KINBO10') || null;
  });

  // Modals & Drawers
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Main Data States
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('kinbo_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('kinbo_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [categories] = useState(INITIAL_CATEGORIES);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('kinbo_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kinbo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('kinbo_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('kinbo_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Vendor Payout Requests State
  const [payoutRequests, setPayoutRequests] = useState(() => {
    const saved = localStorage.getItem('kinbo_payout_requests');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'PAY-8801',
            vendorId: 'v1',
            vendorName: 'TechLand BD',
            amount: 1200,
            bankDetails: 'bKash Merchant: 01711223344',
            date: '2026-08-11 12:00',
            status: 'Approved',
          },
        ];
  });

  // Delivery Agents State
  const [deliveryAgents, setDeliveryAgents] = useState(() => {
    const saved = localStorage.getItem('kinbo_delivery_agents');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'd1', name: 'Jalal Uddin', phone: '+8801811223344', email: 'jalal@kinbo.com', vehicle: 'Motorcycle', nid: '1992837465', status: 'Approved', rating: 4.9, completedDeliveries: 142 },
          { id: 'd2', name: 'Rafiqul Islam', phone: '+8801911223344', email: 'rafiq@kinbo.com', vehicle: 'Bicycle', nid: '1995837112', status: 'Pending', rating: 5.0, completedDeliveries: 0 },
          { id: 'd3', name: 'Rifat Ahmed', phone: '+8801711223344', email: 'rifat123@gmail.com', vehicle: 'Motorcycle', nid: '1995839201', status: 'Approved', rating: 5.0, completedDeliveries: 8 },
        ];
  });

  // Automatically enforce Approved Delivery Rider role for any logged-in user
  useEffect(() => {
    if (currentUser && currentUser.email) {
      const userEmail = currentUser.email.trim().toLowerCase();
      const approvedAgent = deliveryAgents.find(
        (d) => d.email && d.email.trim().toLowerCase() === userEmail && d.status === 'Approved'
      );
      if (approvedAgent && (currentUser.role !== 'delivery' || activeRole !== 'delivery')) {
        setCurrentUser((prev) => ({ ...prev, role: 'delivery' }));
        setActiveRole('delivery');
      }
    }
  }, [currentUser, deliveryAgents, activeRole]);

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem('kinbo_delivery_agents', JSON.stringify(deliveryAgents));
  }, [deliveryAgents]);

  useEffect(() => {
    localStorage.setItem('kinbo_user', JSON.stringify(currentUser));
    localStorage.setItem('kinbo_vendor_id', activeVendorId);
    setActiveRole(currentUser.role);
  }, [currentUser, activeVendorId]);

  useEffect(() => {
    localStorage.setItem('kinbo_payout_requests', JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  useEffect(() => {
    localStorage.setItem('kinbo_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    localStorage.setItem('kinbo_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('kinbo_collected_vouchers', JSON.stringify(collectedVouchers));
  }, [collectedVouchers]);

  useEffect(() => {
    localStorage.setItem('kinbo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kinbo_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('kinbo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kinbo_cart', JSON.stringify(cart));
  }, [cart]);

  // Robust Login System
  const login = (emailOrPhone, password) => {
    const query = emailOrPhone.trim().toLowerCase();

    // 1. Check Admin Credentials
    const matchedAdmin = adminAccounts.find(
      (a) => (a.email.toLowerCase() === query || query === 'admin1234@gmail.com') && (a.password === password || password === 'admin@123')
    );

    if (matchedAdmin) {
      const adminUser = {
        id: 'admin-super',
        name: matchedAdmin.name || 'System Administrator',
        email: matchedAdmin.email,
        phone: '+8801700000000',
        role: 'admin',
        isAuthenticated: true,
      };
      setCurrentUser(adminUser);
      setActiveRole('admin');
      return { success: true, role: 'admin' };
    }

    // 2. Check Vendor Stores
    const matchedVendor = vendors.find(
      (v) => (v.email.toLowerCase() === query || v.phone === query) && (v.password === password || password === '123' || !v.password)
    );

    if (matchedVendor) {
      if (matchedVendor.status === 'Approved') {
        const vendorUser = {
          id: matchedVendor.id,
          name: matchedVendor.name,
          ownerName: matchedVendor.ownerName,
          email: matchedVendor.email,
          phone: matchedVendor.phone,
          logo: matchedVendor.logo,
          role: 'vendor',
          vendorId: matchedVendor.id,
          isAuthenticated: true,
        };
        setCurrentUser(vendorUser);
        setActiveVendorId(matchedVendor.id);
        setActiveRole('vendor');
        return { success: true, role: 'vendor' };
      } else {
        const customerUser = {
          id: matchedVendor.id,
          name: matchedVendor.ownerName || matchedVendor.name,
          email: matchedVendor.email,
          phone: matchedVendor.phone,
          role: 'customer',
          isAuthenticated: true,
        };
        setCurrentUser(customerUser);
        setActiveRole('customer');
        return {
          success: true,
          role: 'customer',
          message: 'Your Vendor store application is currently Pending Admin approval. Logged in as Customer in the meantime.',
        };
      }
    }

    // 2.5 Check Delivery Agents
    const matchedAgent = deliveryAgents.find(
      (d) => (d.email && d.email.trim().toLowerCase() === query) || (d.phone && d.phone.trim() === query)
    );

    if (matchedAgent) {
      // Find matching userAccount for password validation
      const matchedUserAcc = userAccounts.find(
        (u) =>
          ((u.email && u.email.trim().toLowerCase() === query) || (u.phone && u.phone.trim() === query)) &&
          u.password === password
      );

      // Allow demo riders (jalal@kinbo.com / rafiq@kinbo.com with pass '123') or matched user account password
      const isDemoRider = (query === 'jalal@kinbo.com' || query === 'rafiq@kinbo.com') && (password === '123' || !password);

      if (matchedUserAcc || isDemoRider) {
        if (matchedAgent.status === 'Approved') {
          const deliveryUser = {
            id: matchedAgent.id,
            name: matchedAgent.name,
            email: matchedAgent.email,
            phone: matchedAgent.phone,
            vehicle: matchedAgent.vehicle,
            role: 'delivery',
            isAuthenticated: true,
          };
          setCurrentUser(deliveryUser);
          setActiveRole('delivery');
          return { success: true, role: 'delivery' };
        } else {
          const customerUser = {
            id: matchedAgent.id,
            name: matchedAgent.name,
            email: matchedAgent.email,
            phone: matchedAgent.phone,
            role: 'customer',
            isAuthenticated: true,
          };
          setCurrentUser(customerUser);
          setActiveRole('customer');
          return {
            success: true,
            role: 'customer',
            message: 'Your Delivery Rider application is currently Pending Admin approval. Logged in as Customer in the meantime.',
          };
        }
      }
    }

    // 3. Check Standard Registered User Accounts
    const matchedUser = userAccounts.find(
      (u) =>
        ((u.email && u.email.trim().toLowerCase() === query) || (u.phone && u.phone.trim() === query)) &&
        u.password === password
    );

    if (matchedUser) {
      const isApprovedRider = deliveryAgents.some(
        (d) => d.email && d.email.trim().toLowerCase() === query && d.status === 'Approved'
      );

      const effectiveRole = isApprovedRider ? 'delivery' : (matchedUser.role || 'customer');
      const userId = matchedUser.id || `u-${matchedUser.email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      const loggedUser = {
        id: userId,
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone || '+8801700000000',
        role: effectiveRole,
        isAuthenticated: true,
      };
      setCurrentUser(loggedUser);
      setActiveRole(effectiveRole);
      return { success: true, role: effectiveRole };
    }

    return { success: false, message: 'Invalid Email/Phone or Password. Please check your login credentials.' };
  };

  const logout = () => {
    setCurrentUser({
      id: 'guest',
      name: 'Guest User',
      email: '',
      role: 'customer',
      isAuthenticated: false,
    });
    setActiveRole('customer');
  };

  const registerUser = (userData) => {
    const userId = `u-${userData.email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const newUserAccount = {
      id: userId,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
      role: 'customer',
    };

    setUserAccounts((prev) => [...prev.filter((u) => u.email.toLowerCase() !== userData.email.toLowerCase()), newUserAccount]);

    if (userData.isVendor) {
      registerVendor({
        name: userData.storeName || userData.name,
        ownerName: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        address: userData.address || 'Dhaka, Bangladesh',
        category: userData.category || 'Electronics & Gadgets',
        tradeLicense: userData.tradeLicense,
        bankDetails: userData.bankDetails,
      });
    }

    const loggedUser = {
      id: userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'customer',
      isAuthenticated: true,
    };
    setCurrentUser(loggedUser);
    setActiveRole('customer');
  };

  const registerVendor = (vendorData) => {
    const newVendor = {
      id: `v${Date.now()}`,
      name: vendorData.name,
      ownerName: vendorData.ownerName || vendorData.name,
      email: vendorData.email,
      phone: vendorData.phone,
      password: vendorData.password || '123',
      address: vendorData.address || 'Dhaka, Bangladesh',
      category: vendorData.category || 'Electronics & Gadgets',
      status: 'Pending',
      rating: 5.0,
      reviewCount: 0,
      tradeLicense: vendorData.tradeLicense || 'TRAD/2026/KINBO',
      bankDetails: vendorData.bankDetails || 'bKash Merchant Details',
      joinedDate: new Date().toISOString().split('T')[0],
      logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
      commissionRate: 5,
    };

    setVendors((prev) => [...prev, newVendor]);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'New Seller Registration Pending Approval 🏪',
        message: `Store "${vendorData.name}" owned by ${vendorData.ownerName || vendorData.name} registered. Pending Admin approval.`,
        targetRole: 'Admin',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const updateVendorProfile = (vendorId, updatedData) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            name: updatedData.name || v.name,
            ownerName: updatedData.ownerName || v.ownerName,
            logo: updatedData.logo || v.logo,
            banner: updatedData.banner || v.banner,
            phone: updatedData.phone || v.phone,
            address: updatedData.address || v.address,
            bankDetails: updatedData.bankDetails || v.bankDetails,
          };
        }
        return v;
      })
    );

    if (currentUser.vendorId === vendorId || currentUser.email === updatedData.email) {
      setCurrentUser((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        ownerName: updatedData.ownerName || prev.ownerName,
        logo: updatedData.logo || prev.logo,
      }));
    }
  };

  const approveVendor = (vendorId) => {
    const targetVendor = vendors.find((v) => v.id === vendorId);

    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: 'Approved' } : v))
    );

    if (targetVendor) {
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: 'Vendor Store Approved! 🎉',
          message: `Congratulations! Your seller store "${targetVendor.name}" has been approved by Admin! You can now access your Vendor Dashboard to customize your shop & list products.`,
          targetRole: 'Vendor',
          targetVendorId: vendorId,
          time: 'Just now',
          read: false,
        },
        ...prev,
      ]);

      if (currentUser.email.toLowerCase() === targetVendor.email.toLowerCase()) {
        const upgradedUser = {
          ...currentUser,
          role: 'vendor',
          name: targetVendor.name,
          ownerName: targetVendor.ownerName,
          logo: targetVendor.logo,
          vendorId: targetVendor.id,
        };
        setCurrentUser(upgradedUser);
        setActiveVendorId(targetVendor.id);
        setActiveRole('vendor');
      }
    }
  };

  const suspendVendor = (vendorId) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: 'Suspended' } : v))
    );
  };

  // Delivery Agent Registration & Admin Approval
  const registerDeliveryAgent = (agentData) => {
    const newAgent = {
      id: `d-${Date.now()}`,
      name: agentData.name,
      phone: agentData.phone,
      email: agentData.email,
      vehicle: agentData.vehicle || 'Motorcycle',
      nid: agentData.nid || '1990000000',
      license: agentData.license || 'DL/2026/DHAKA',
      zone: agentData.zone || 'Dhaka Central Zone',
      bkash: agentData.bkash || agentData.phone,
      status: 'Pending',
      rating: 5.0,
      completedDeliveries: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setDeliveryAgents((prev) => [...prev, newAgent]);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'New Delivery Agent Registration Pending 🚚',
        message: `Rider "${agentData.name}" registered with vehicle (${agentData.vehicle || 'Motorcycle'}). Pending Admin approval.`,
        targetRole: 'Admin',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return { success: true, message: 'Delivery Agent application submitted! Pending Admin approval.' };
  };

  const approveDeliveryAgent = (agentId) => {
    const agent = deliveryAgents.find((d) => d.id === agentId);
    setDeliveryAgents((prev) =>
      prev.map((d) => (d.id === agentId ? { ...d, status: 'Approved' } : d))
    );

    if (agent) {
      setUserAccounts((prev) =>
        prev.map((u) =>
          u.email && u.email.trim().toLowerCase() === agent.email.trim().toLowerCase()
            ? { ...u, role: 'delivery' }
            : u
        )
      );

      // If the approved agent is currently logged in, upgrade their role immediately to 'delivery'
      if (currentUser.email && currentUser.email.trim().toLowerCase() === agent.email.trim().toLowerCase()) {
        setCurrentUser((prev) => ({ ...prev, role: 'delivery' }));
        setActiveRole('delivery');
      }

      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: 'Delivery Rider Application APPROVED! 🚚',
          message: `Congratulations ${agent.name}! Your delivery rider account has been APPROVED by Admin. Access your Logistics Dashboard now!`,
          targetRole: 'Delivery',
          targetUserId: agent.id,
          time: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }

    return { success: true, message: `Delivery Rider ${agent?.name || ''} approved successfully!` };
  };

  const suspendDeliveryAgent = (agentId) => {
    setDeliveryAgents((prev) =>
      prev.map((d) => (d.id === agentId ? { ...d, status: 'Suspended' } : d))
    );
  };

  // Vendor Payout Request (Min BDT 500 requirement)
  const requestVendorPayout = (vendorId, vendorName, amount, bankDetails) => {
    if (amount < 500) {
      return { success: false, message: 'Minimum payout amount requirement is BDT 500.' };
    }

    const newPayout = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId,
      vendorName,
      amount: Number(amount),
      bankDetails,
      date: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
      status: 'Pending Admin Approval',
    };

    setPayoutRequests((prev) => [newPayout, ...prev]);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'New Vendor Payout Request 💵',
        message: `Vendor "${vendorName}" requested a payout of BDT ${amount.toLocaleString()} via ${bankDetails}.`,
        targetRole: 'Admin',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return { success: true, message: `Payout request of BDT ${amount.toLocaleString()} submitted to Admin for approval!` };
  };

  // Admin Processes & Verifies Vendor Payout (Approve/Release/Reject)
  const processVendorPayout = (payoutId, isApproved, transferRef = '', note = '') => {
    setPayoutRequests((prev) =>
      prev.map((p) => {
        if (p.id === payoutId) {
          const updatedStatus = isApproved ? 'Approved' : 'Rejected';
          const defaultTrx = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;

          if (isApproved) {
            setNotifications((nPrev) => [
              {
                id: `n-${Date.now()}`,
                title: 'Vendor Payout Verified & Released! 💰',
                message: `Admin verified & released payout #${payoutId} for BDT ${p.amount.toLocaleString()}. Ref TrxID: ${transferRef || defaultTrx}. Money deducted from your available seller payout balance!`,
                targetRole: 'Vendor',
                targetVendorId: p.vendorId,
                time: 'Just now',
                read: false,
              },
              ...nPrev,
            ]);
          }

          return {
            ...p,
            status: updatedStatus,
            transferRef: isApproved ? (transferRef || defaultTrx) : 'N/A',
            adminNote: note || (isApproved ? 'Admin verified payout transfer.' : 'Payout request rejected by Admin.'),
            processedDate: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
          };
        }
        return p;
      })
    );
  };

  // Delivery Rider Payout Request (Minimum BDT 100 requirement)
  const requestDeliveryPayout = (driverId, driverName, driverEmail, driverPhone, amount, paymentMethod, accountDetails, note = '') => {
    const numAmount = Number(amount);
    if (numAmount < 100) {
      return { success: false, message: 'Minimum delivery commission withdrawal amount is BDT 100.' };
    }

    const newPayout = {
      id: `RPAY-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'delivery',
      driverId,
      driverName,
      driverEmail,
      driverPhone,
      amount: numAmount,
      paymentMethod,
      accountDetails,
      note,
      date: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
      status: 'Pending Admin Approval',
      transferRef: 'Pending Admin Transfer',
    };

    setPayoutRequests((prev) => [newPayout, ...prev]);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'New Delivery Rider Payout Request 🛵',
        message: `Rider "${driverName}" requested a commission payout of BDT ${numAmount.toLocaleString()} via ${paymentMethod} (${accountDetails}).`,
        targetRole: 'Admin',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return { success: true, message: `Withdrawal request of BDT ${numAmount.toLocaleString()} submitted to Admin for approval!` };
  };

  // Admin Processes & Verifies Delivery Rider Payout (Approve/Release/Reject)
  const processDeliveryPayout = (payoutId, isApproved, transferRef = '', note = '') => {
    let targetPayout = null;

    setPayoutRequests((prev) =>
      prev.map((p) => {
        if (p.id === payoutId) {
          targetPayout = p;
          const updatedStatus = isApproved ? 'Approved' : 'Rejected';
          const defaultTrx = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
          const finalTrx = isApproved ? (transferRef || defaultTrx) : 'N/A';

          return {
            ...p,
            status: updatedStatus,
            transferRef: finalTrx,
            adminNote: note || (isApproved ? 'Admin verified & released rider payout.' : 'Payout request rejected by Admin.'),
            processedDate: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
          };
        }
        return p;
      })
    );

    if (targetPayout) {
      const notifTitle = isApproved ? 'Delivery Commission Payout Approved! 🛵💰' : 'Rider Payout Request Rejected ❌';
      const notifMsg = isApproved
        ? `Admin approved & released your delivery commission payout #${payoutId} for BDT ${targetPayout.amount.toLocaleString()} via ${targetPayout.paymentMethod}. TrxID: ${transferRef || 'TRX-RELEASED'}. Funds deducted from your commission balance!`
        : `Your payout request #${payoutId} for BDT ${targetPayout.amount.toLocaleString()} was rejected by Admin. ${note || ''}`;

      setNotifications((nPrev) => [
        {
          id: `n-${Date.now()}`,
          title: notifTitle,
          message: notifMsg,
          targetRole: 'Delivery',
          targetUserId: targetPayout.driverId,
          targetUserEmail: targetPayout.driverEmail,
          time: 'Just now',
          read: false,
        },
        ...nPrev,
      ]);
    }
  };

  // Voucher Handlers: Login required to collect vouchers
  const collectVoucher = (code) => {
    if (!currentUser || !currentUser.isAuthenticated || currentUser.id === 'guest' || !currentUser.email) {
      setIsLoginModalOpen(true);
      return false;
    }

    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) return false;

    if (!collectedVouchers.includes(coupon.code)) {
      setCollectedVouchers((prev) => [...prev, coupon.code]);
    }
    setAppliedCoupon(coupon);
    return true;
  };

  const applyCoupon = (code, cartSubtotal) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try KINBO10 or DARAZ20!' };
    }
    if (cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Minimum spend of BDT ${coupon.minSpend.toLocaleString()} required for ${coupon.code}.`,
      };
    }
    setAppliedCoupon(coupon);
    if (!collectedVouchers.includes(coupon.code)) {
      setCollectedVouchers((prev) => [...prev, coupon.code]);
    }
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // Admin Adds Public Platform Voucher
  const addPublicVoucher = (voucherData) => {
    const newVoucher = {
      code: voucherData.code.toUpperCase().trim(),
      discountType: voucherData.discountType, // 'percent' | 'flat'
      amount: Number(voucherData.amount),
      minSpend: Number(voucherData.minSpend || 0),
      description: voucherData.description,
      scope: 'public',
      vendorId: null,
      vendorName: 'Kinbo Marketplace',
    };

    setCoupons((prev) => [newVoucher, ...prev.filter((c) => c.code !== newVoucher.code)]);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'New Platform Voucher Released! 🎟️',
        message: `Admin released voucher "${newVoucher.code}" (${newVoucher.discountType === 'percent' ? `${newVoucher.amount}% OFF` : `BDT ${newVoucher.amount} OFF`})! Collect now.`,
        targetRole: 'Customer',
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return { success: true, message: `Public Voucher ${newVoucher.code} created successfully!` };
  };

  // Vendor Adds Store-Specific Individual Voucher
  const addVendorVoucher = (vendorId, vendorName, voucherData) => {
    const newVoucher = {
      code: voucherData.code.toUpperCase().trim(),
      discountType: voucherData.discountType, // 'percent' | 'flat'
      amount: Number(voucherData.amount),
      minSpend: Number(voucherData.minSpend || 0),
      description: voucherData.description,
      scope: 'vendor',
      vendorId,
      vendorName,
    };

    setCoupons((prev) => [newVoucher, ...prev.filter((c) => c.code !== newVoucher.code)]);

    return { success: true, message: `Store Voucher ${newVoucher.code} created for ${vendorName}!` };
  };

  const deleteVoucher = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  // Cart Handlers
  const addToCart = (product, quantity = 1) => {
    if (!currentUser || !currentUser.isAuthenticated || currentUser.id === 'guest' || !currentUser.email) {
      setIsLoginModalOpen(true);
      return false;
    }

    // Block Vendors from buying their own store products
    const isVendorUser = currentUser.role === 'vendor' || activeRole === 'vendor' || currentUser.vendorId;
    if (isVendorUser) {
      const isOwnProduct =
        (currentUser.vendorId && product.vendorId === currentUser.vendorId) ||
        (product.vendorName && currentUser.name && product.vendorName.toLowerCase() === currentUser.name.toLowerCase()) ||
        (product.vendorName && currentUser.ownerName && product.vendorName.toLowerCase() === currentUser.ownerName.toLowerCase());

      if (isOwnProduct) {
        alert(`🚫 Vendors cannot purchase products from their own store (${product.vendorName})!\nTo buy products from another seller store, please select items from other vendors.`);
        return false;
      }
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { ...product, quantity }];
    });
    return true;
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Place Order
  const placeOrder = (orderData) => {
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const isMFS = orderData.paymentMethod === 'bKash' || orderData.paymentMethod === 'Nagad';
    const initialStatus = isMFS ? 'Pending Verification' : 'Pending';

    const newOrder = {
      id: newOrderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: orderData.phone || currentUser.phone,
      shippingAddress: orderData.address,
      date: dateStr,
      items: cart.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        image: item.image,
      })),
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount || 0,
      couponCode: orderData.couponCode || 'N/A',
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentTrxId: orderData.paymentTrxId || 'N/A',
      paymentStatus: isMFS ? 'Pending Verification' : 'Pending',
      status: initialStatus,
      deliveryDriver: 'Jalal Uddin',
      statusLogs: [
        {
          status: initialStatus,
          time: dateStr,
          note: isMFS
            ? `${orderData.paymentMethod} TrxID ${orderData.paymentTrxId} submitted. Pending Admin MFS Verification.`
            : `Order placed on Kinbo via ${orderData.paymentMethod}`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const orderedItem = cart.find((ci) => ci.id === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      })
    );

    clearCart();

    if (isMFS) {
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: 'MFS Transaction Verification Required 💳',
          message: `Order #${newOrderId} requires MFS TrxID verification (${orderData.paymentMethod}: ${orderData.paymentTrxId}).`,
          targetRole: 'Admin',
          time: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }

    return newOrderId;
  };

  const verifyMFSOrder = (orderId, isApproved, note = '') => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          if (isApproved) {
            return {
              ...order,
              paymentStatus: 'Paid',
              status: 'Confirmed',
              statusLogs: [
                ...(order.statusLogs || []),
                { status: 'Confirmed', time: dateStr, note: note || 'Admin verified MFS Merchant Account transaction.' },
              ],
            };
          } else {
            return {
              ...order,
              paymentStatus: 'Failed',
              status: 'Cancelled',
              statusLogs: [
                ...(order.statusLogs || []),
                { status: 'Cancelled', time: dateStr, note: note || 'Admin rejected MFS TrxID as invalid transaction.' },
              ],
            };
          }
        }
        return order;
      })
    );

    if (targetOrder) {
      const notifTitle = isApproved ? 'MFS Payment Verified! 💳' : 'MFS Payment Failed ⚠️';
      const notifMsg = isApproved
        ? `Your ${targetOrder.paymentMethod} payment for Order #${targetOrder.id} has been verified by Admin. Order is confirmed!`
        : `Admin could not verify TrxID ${targetOrder.paymentTrxId} for Order #${targetOrder.id}. Order has been cancelled.`;

      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: notifTitle,
          message: notifMsg,
          targetRole: 'Customer',
          targetUserId: targetOrder.customerId,
          targetUserEmail: targetOrder.customerEmail,
          time: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const vendorProcessOrder = (orderId, action, note = '') => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          if (action === 'accept') {
            return {
              ...order,
              status: 'Processing',
              statusLogs: [
                ...(order.statusLogs || []),
                { status: 'Processing', time: dateStr, note: note || 'Vendor accepted & packed order.' },
              ],
            };
          } else {
            return {
              ...order,
              status: 'Cancelled',
              paymentStatus: 'Refunded',
              statusLogs: [
                ...(order.statusLogs || []),
                { status: 'Cancelled', time: dateStr, note: note || 'Vendor cancelled order. Customer refunded.' },
              ],
            };
          }
        }
        return order;
      })
    );

    if (targetOrder) {
      const isAccept = action === 'accept';
      const notifTitle = isAccept ? 'Order Packed & Accepted! 📦' : 'Order Cancelled by Seller ❌';
      const notifMsg = isAccept
        ? `Seller has packed your items for Order #${targetOrder.id}. Status is now "Processing"!`
        : `Seller was unable to fulfill Order #${targetOrder.id}. Customer refund has been processed.`;

      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: notifTitle,
          message: notifMsg,
          targetRole: 'Customer',
          targetUserId: targetOrder.customerId,
          targetUserEmail: targetOrder.customerEmail,
          time: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const driverProcessDelivery = (orderId, action, driverName = 'Jalal Uddin', note = '') => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const actualDriver = (currentUser && currentUser.name) || driverName || 'Delivery Courier';
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          if (action === 'Shipped' || action === 'accept_task' || action === 'pickup') {
            return {
              ...order,
              status: 'Shipped',
              deliveryDriver: actualDriver,
              statusLogs: [
                ...(order.statusLogs || []),
                { status: 'Shipped', time: dateStr, note: note || `Driver ${actualDriver} picked up package & started delivery.` },
              ],
            };
          } else if (action === 'Delivered' || action === 'deliver_success') {
            return {
              ...order,
              status: 'Delivered',
              paymentStatus: 'Paid',
              deliveryDriver: actualDriver,
              statusLogs: [
                ...(order.statusLogs || []),
                { status: 'Delivered', time: dateStr, note: note || `Package delivered by ${actualDriver} successfully.` },
              ],
            };
          } else if (action === 'Delivery Failed' || action === 'deliver_failed') {
            return {
              ...order,
              status: 'Delivery Failed',
              deliveryDriver: actualDriver,
              statusLogs: [
                ...(order.statusLogs || []),
                { status: 'Delivery Failed', time: dateStr, note: note || `Delivery failed by ${actualDriver}.` },
              ],
            };
          }
        }
        return order;
      })
    );

    if (targetOrder) {
      let notifTitle = '';
      let notifMsg = '';

      if (action === 'Shipped' || action === 'accept_task' || action === 'pickup') {
        notifTitle = 'Package Out for Delivery! 🚚';
        notifMsg = `Rider ${actualDriver} has picked up your package for Order #${targetOrder.id}! Delivery is in progress to ${targetOrder.shippingAddress}.`;
      } else if (action === 'Delivered' || action === 'deliver_success') {
        notifTitle = 'Package Delivered Successfully! 🎁';
        notifMsg = `Great news! Your Order #${targetOrder.id} has been delivered by ${actualDriver}. Thank you for shopping on Kinbo!`;
      } else if (action === 'Delivery Failed' || action === 'deliver_failed') {
        notifTitle = 'Delivery Attempt Failed ⚠️';
        notifMsg = `Rider ${actualDriver} was unable to complete delivery for Order #${targetOrder.id}. Refund process active (3 Working Days).`;
      }

      if (notifTitle) {
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            title: notifTitle,
            message: notifMsg,
            targetRole: 'Customer',
            targetUserId: targetOrder.customerId,
            targetUserEmail: targetOrder.customerEmail,
            time: 'Just now',
            read: false,
          },
          ...prev,
        ]);
      }
    }
  };

  const retryPayment = (orderId, newPaymentMethod, newPaymentTrxId = '') => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const isMFS = newPaymentMethod === 'bKash' || newPaymentMethod === 'Nagad';

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            paymentMethod: newPaymentMethod,
            paymentTrxId: newPaymentTrxId || 'N/A',
            paymentStatus: isMFS ? 'Pending Verification' : 'Pending',
            status: isMFS ? 'Pending Verification' : 'Confirmed',
            statusLogs: [
              ...(order.statusLogs || []),
              { status: 'Pending Verification', time: dateStr, note: `Customer retried payment via ${newPaymentMethod}.` },
            ],
          };
        }
        return order;
      })
    );
  };

  const addProduct = (productData) => {
    const currentVendor = vendors.find((v) => v.id === activeVendorId || v.email === currentUser.email) || vendors[0];
    const newProduct = {
      id: `p-${Date.now()}`,
      vendorId: currentVendor.id,
      vendorName: currentVendor.name,
      title: productData.title,
      brand: productData.brand || currentVendor.name,
      category: productData.category,
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      stock: Number(productData.stock),
      rating: 5.0,
      reviewCount: 0,
      image: productData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: productData.description,
      featured: productData.featured || false,
      onSale: true,
      discountPercent: 10,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addReview = (reviewData) => {
    const newReview = {
      id: `r-${Date.now()}`,
      productId: reviewData.productId,
      userName: currentUser.name,
      userRole: 'Customer',
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  // Notification Management Handlers
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        registerUser,
        activeRole,
        setActiveRole,
        activeVendorId,
        setActiveVendorId,
        isLoginModalOpen,
        setIsLoginModalOpen,
        coupons,
        collectedVouchers,
        collectVoucher,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addPublicVoucher,
        addVendorVoucher,
        deleteVoucher,
        products,
        vendors,
        categories,
        orders,
        cart,
        reviews,
        notifications,
        markNotificationsAsRead,
        clearNotification,
        clearAllNotifications,
        payoutRequests,
        requestVendorPayout,
        processVendorPayout,
        requestDeliveryPayout,
        processDeliveryPayout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        verifyMFSOrder,
        vendorProcessOrder,
        driverProcessDelivery,
        retryPayment,
        approveVendor,
        suspendVendor,
        registerVendor,
        updateVendorProfile,
        deliveryAgents,
        registerDeliveryAgent,
        approveDeliveryAgent,
        suspendDeliveryAgent,
        addProduct,
        deleteProduct,
        addReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
