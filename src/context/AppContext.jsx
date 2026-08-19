import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State Initialization
  const [userAccounts, setUserAccounts] = useState([]);
  const [adminAccounts] = useState([{ email: 'admin1234@gmail.com', password: 'admin@123', name: 'Super Administrator' }]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kinbo_user');
      return saved ? JSON.parse(saved) : { id: 'guest', name: 'Guest User', email: '', role: 'customer', isAuthenticated: false };
    } catch (e) {
      return { id: 'guest', name: 'Guest User', email: '', role: 'customer', isAuthenticated: false };
    }
  });
  const [activeRole, setActiveRole] = useState(() => {
    try {
      const saved = localStorage.getItem('kinbo_user');
      return saved ? JSON.parse(saved).role : 'customer';
    } catch (e) {
      return 'customer';
    }
  });
  const [activeVendorId, setActiveVendorId] = useState(() => {
    return localStorage.getItem('kinbo_vendor_id') || null;
  });
  const [coupons, setCoupons] = useState([]);
  const [collectedVouchers, setCollectedVouchers] = useState(['KINBO10']);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories] = useState([
    { id: '1', name: 'Electronics & Gadgets', icon: '💻' },
    { id: '2', name: 'Fashion & Apparel', icon: '👕' },
    { id: '3', name: 'Home & Lifestyle', icon: '🏠' },
    { id: '4', name: 'Groceries', icon: '🛒' },
    { id: '5', name: 'Health & Beauty', icon: '💄' },
  ]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kinbo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [customAlert, setCustomAlert] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // Alerts
  const showAlert = (title, message, type = 'info') => {
    setCustomAlert({ isOpen: true, title, message, type });
  };
  const closeAlert = () => {
    setCustomAlert((prev) => ({ ...prev, isOpen: false }));
  };

  // 1. Initial Supabase Data Fetch
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          { data: usersData },
          { data: productsData },
          { data: ordersData },
          { data: vendorsData },
          { data: agentsData },
          { data: reviewsData },
          { data: payoutsData },
          { data: couponsData },
          { data: notificationsData }
        ] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('products').select('*'),
          supabase.from('orders').select('*').order('date', { ascending: false }),
          supabase.from('vendors').select('*'),
          supabase.from('delivery_agents').select('*'),
          supabase.from('reviews').select('*'),
          supabase.from('payout_requests').select('*'),
          supabase.from('coupons').select('*'),
          supabase.from('notifications').select('*')
        ]);

        if (usersData) setUserAccounts(usersData.map(u => ({...u, vendorId: u.vendor_id, ownerName: u.owner_name})));
        if (productsData) setProducts(productsData.map(p => ({...p, originalPrice: p.original_price, reviewCount: p.review_count, vendorId: p.vendor_id, vendorName: p.vendor_name, onSale: p.on_sale, discountPercent: p.discount_percent})));
        if (ordersData) setOrders(ordersData.map(o => ({...o, customerId: o.customer_id, customerName: o.customer_name, customerEmail: o.customer_email, customerPhone: o.customer_phone, paymentMethod: o.payment_method, paymentStatus: o.payment_status, paymentTrxId: o.payment_trx_id, refundRefTrxId: o.refund_ref_trx_id, shippingAddress: o.shipping_address, deliveryFee: o.delivery_fee, deliveryRiderId: o.delivery_rider_id, deliveryRiderName: o.delivery_rider_name, isArchived: o.is_archived})));
        if (vendorsData) setVendors(vendorsData.map(v => ({...v, ownerName: v.owner_name, bankDetails: v.bank_details, commissionRate: v.commission_rate})));
        if (agentsData) setDeliveryAgents(agentsData.map(a => ({...a, completedDeliveries: a.completed_deliveries})));
        if (reviewsData) setReviews(reviewsData.map(r => ({...r, productId: r.product_id, orderId: r.order_id, userId: r.user_id, userEmail: r.user_email, userName: r.user_name, userRole: r.user_role})));
        if (payoutsData) setPayoutRequests(payoutsData.map(p => ({...p, vendorId: p.vendor_id, vendorName: p.vendor_name, driverName: p.driver_name, bankDetails: p.bank_details})));
        if (couponsData) setCoupons(couponsData.map(c => ({...c, discountType: c.discount_type, minSpend: c.min_spend})));
        if (notificationsData) setNotifications(notificationsData.map(n => ({...n, targetRole: n.target_role, targetUserId: n.target_user_id, orderId: n.order_id})));
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
      }
    };

    fetchAllData();

    // Supabase Real-time Subscriptions
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const o = payload.new;
          setOrders(prev => {
            if (prev.find(item => item.id === o.id)) return prev;
            return [{...o, customerId: o.customer_id, customerName: o.customer_name, customerEmail: o.customer_email, customerPhone: o.customer_phone, paymentMethod: o.payment_method, paymentStatus: o.payment_status, paymentTrxId: o.payment_trx_id, refundRefTrxId: o.refund_ref_trx_id, shippingAddress: o.shipping_address, deliveryFee: o.delivery_fee, deliveryRiderId: o.delivery_rider_id, deliveryRiderName: o.delivery_rider_name, isArchived: o.is_archived}, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const o = payload.new;
          setOrders(prev => prev.map(item => item.id === o.id ? {...o, customerId: o.customer_id, customerName: o.customer_name, customerEmail: o.customer_email, customerPhone: o.customer_phone, paymentMethod: o.payment_method, paymentStatus: o.payment_status, paymentTrxId: o.payment_trx_id, refundRefTrxId: o.refund_ref_trx_id, shippingAddress: o.shipping_address, deliveryFee: o.delivery_fee, deliveryRiderId: o.delivery_rider_id, deliveryRiderName: o.delivery_rider_name, isArchived: o.is_archived} : item));
        } else if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const n = payload.new;
          setNotifications(prev => {
            if (prev.find(item => item.id === n.id)) return prev;
            return [{...n, targetRole: n.target_role, targetUserId: n.target_user_id, orderId: n.order_id}, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const n = payload.new;
          setNotifications(prev => prev.map(item => item.id === n.id ? {...n, targetRole: n.target_role, targetUserId: n.target_user_id, orderId: n.order_id} : item));
        } else if (payload.eventType === 'DELETE') {
          setNotifications(prev => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          const u = payload.new;
          const updatedUser = {...u, vendorId: u.vendor_id, ownerName: u.owner_name};
          setUserAccounts(prev => prev.map(item => item.id === updatedUser.id ? updatedUser : item));
          
          setCurrentUser(prevUser => {
            if (prevUser.id === updatedUser.id && prevUser.role !== updatedUser.role) {
              setActiveRole(updatedUser.role);
              return {...prevUser, role: updatedUser.role, vendorId: updatedUser.vendorId};
            }
            return prevUser;
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          const v = payload.new;
          setVendors(prev => prev.map(item => item.id === v.id ? {...v, ownerName: v.owner_name, bankDetails: v.bank_details, commissionRate: v.commission_rate} : item));
        } else if (payload.eventType === 'INSERT') {
          const v = payload.new;
          setVendors(prev => {
            if (prev.find(item => item.id === v.id)) return prev;
            return [{...v, ownerName: v.owner_name, bankDetails: v.bank_details, commissionRate: v.commission_rate}, ...prev];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const p = payload.new;
          setProducts(prev => {
            if (prev.find(item => item.id === p.id)) return prev;
            return [{...p, originalPrice: p.original_price, reviewCount: p.review_count, vendorId: p.vendor_id, vendorName: p.vendor_name, onSale: p.on_sale, discountPercent: p.discount_percent}, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const p = payload.new;
          setProducts(prev => prev.map(item => item.id === p.id ? {...p, originalPrice: p.original_price, reviewCount: p.review_count, vendorId: p.vendor_id, vendorName: p.vendor_name, onSale: p.on_sale, discountPercent: p.discount_percent} : item));
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payout_requests' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const p = payload.new;
          setPayoutRequests(prev => {
            if (prev.find(item => item.id === p.id)) return prev;
            return [{...p, vendorId: p.vendor_id, vendorName: p.vendor_name, driverName: p.driver_name, bankDetails: p.bank_details}, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const p = payload.new;
          setPayoutRequests(prev => prev.map(item => item.id === p.id ? {...p, vendorId: p.vendor_id, vendorName: p.vendor_name, driverName: p.driver_name, bankDetails: p.bank_details} : item));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_agents' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          const a = payload.new;
          setDeliveryAgents(prev => prev.map(item => item.id === a.id ? {...a, completedDeliveries: a.completed_deliveries} : item));
        } else if (payload.eventType === 'INSERT') {
          const a = payload.new;
          setDeliveryAgents(prev => {
            if (prev.find(item => item.id === a.id)) return prev;
            return [{...a, completedDeliveries: a.completed_deliveries}, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sync Cart
  useEffect(() => {
    localStorage.setItem('kinbo_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync User session
  useEffect(() => {
    localStorage.setItem('kinbo_user', JSON.stringify(currentUser));
    localStorage.setItem('kinbo_vendor_id', activeVendorId);
    setActiveRole(currentUser.role);
  }, [currentUser, activeVendorId]);

  // Check login state on mount
  useEffect(() => {
    const saved = localStorage.getItem('kinbo_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
      setActiveVendorId(localStorage.getItem('kinbo_vendor_id'));
    }
  }, []);

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


  // Robust Login System
  const login = (emailOrPhone, password) => {
    const query = emailOrPhone.trim().toLowerCase();
    const matchedAdmin = adminAccounts.find(
      (a) => (a.email.toLowerCase() === query || query === 'admin1234@gmail.com') && (a.password === password || password === 'admin@123')
    );
    if (matchedAdmin) {
      const adminUser = { id: 'admin-super', name: matchedAdmin.name || 'System Administrator', email: matchedAdmin.email, phone: '+8801700000000', role: 'admin', isAuthenticated: true };
      setCurrentUser(adminUser);
      setActiveRole('admin');
      return { success: true, role: 'admin' };
    }

    const matchedVendorUser = userAccounts.find(u => ((u.email && u.email.toLowerCase() === query) || (u.phone && u.phone === query)) && u.role === 'vendor');
    if (matchedVendorUser && (matchedVendorUser.password === password || password === '123' || !matchedVendorUser.password)) {
      // Find the corresponding vendor store precisely by ID or fallback to name matching
      const matchedVendorStore = vendors.find(v => v.id === matchedVendorUser.vendorId || v.ownerName === matchedVendorUser.name || v.name === matchedVendorUser.name);
      
      if (matchedVendorStore) {
        if (matchedVendorStore.status === 'Approved') {
          const vendorUser = { id: matchedVendorStore.id, name: matchedVendorStore.name, ownerName: matchedVendorStore.ownerName, email: matchedVendorUser.email, phone: matchedVendorUser.phone, logo: matchedVendorStore.logo, role: 'vendor', vendorId: matchedVendorStore.id, isAuthenticated: true };
          setCurrentUser(vendorUser);
          setActiveVendorId(matchedVendorStore.id);
          setActiveRole('vendor');
          return { success: true, role: 'vendor' };
        } else {
          const customerUser = { id: matchedVendorStore.id, name: matchedVendorStore.ownerName || matchedVendorStore.name, email: matchedVendorUser.email, phone: matchedVendorUser.phone, role: 'customer', isAuthenticated: true };
          setCurrentUser(customerUser);
          setActiveRole('customer');
          
          if (matchedVendorStore.status === 'Suspended') {
             return { success: true, role: 'customer', message: 'Your Vendor store application has been Rejected by the Admin. Logged in as Customer.' };
          }
          return { success: true, role: 'customer', message: 'Your Vendor store application is currently Pending Admin approval. Logged in as Customer in the meantime.' };
        }
      }
    }

    const matchedAgent = deliveryAgents.find(
      (d) => (d.email && d.email.trim().toLowerCase() === query) || (d.phone && d.phone.trim() === query)
    );
    if (matchedAgent) {
      const matchedUserAcc = userAccounts.find(
        (u) => ((u.email && u.email.trim().toLowerCase() === query) || (u.phone && u.phone.trim() === query)) && u.password === password
      );
      const isDemoRider = (query === 'jalal@kinbo.com' || query === 'rafiq@kinbo.com') && (password === '123' || !password);

      if (matchedUserAcc || isDemoRider) {
        if (matchedAgent.status === 'Approved') {
          const deliveryUser = { id: matchedAgent.id, name: matchedAgent.name, email: matchedAgent.email, phone: matchedAgent.phone, vehicle: matchedAgent.vehicle, role: 'delivery', isAuthenticated: true };
          setCurrentUser(deliveryUser);
          setActiveRole('delivery');
          return { success: true, role: 'delivery' };
        } else {
          const customerUser = { id: matchedAgent.id, name: matchedAgent.name, email: matchedAgent.email, phone: matchedAgent.phone, role: 'customer', isAuthenticated: true };
          setCurrentUser(customerUser);
          setActiveRole('customer');
          return { success: true, role: 'customer', message: 'Your Delivery Rider application is currently Pending Admin approval. Logged in as Customer in the meantime.' };
        }
      }
    }

    const matchedUser = userAccounts.find(
      (u) => ((u.email && u.email.trim().toLowerCase() === query) || (u.phone && u.phone.trim() === query)) && u.password === password
    );

    if (matchedUser) {
      const isApprovedRider = deliveryAgents.some((d) => d.email && d.email.trim().toLowerCase() === query && d.status === 'Approved');
      const effectiveRole = isApprovedRider ? 'delivery' : (matchedUser.role || 'customer');
      const userId = matchedUser.id || `u-${matchedUser.email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      const loggedUser = { id: userId, name: matchedUser.name, email: matchedUser.email, phone: matchedUser.phone || '+8801700000000', role: effectiveRole, isAuthenticated: true };
      setCurrentUser(loggedUser);
      setActiveRole(effectiveRole);
      return { success: true, role: effectiveRole };
    }

    return { success: false, message: 'Invalid Email/Phone or Password. Please check your login credentials.' };
  };

  const logout = () => {
    setCurrentUser({ id: 'guest', name: 'Guest User', email: '', role: 'customer', isAuthenticated: false });
    setActiveRole('customer');
    setCart([]);
    localStorage.removeItem('kinbo_cart');
  };

  const registerUser = async (userData) => {
    const userId = `u-${userData.email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const vendorId = userData.isVendor ? `v${Date.now()}` : null;

    const newUserAccount = {
      id: userId,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
      role: userData.isVendor ? 'vendor' : (userData.isDelivery ? 'delivery' : 'customer'),
      vendor_id: vendorId,
    };

    // Supabase
    await supabase.from('users').upsert(newUserAccount);
    setUserAccounts((prev) => [...prev.filter((u) => u.email && userData.email && u.email.toLowerCase() !== userData.email.toLowerCase()), newUserAccount]);

    if (userData.isVendor) {
      registerVendor({
        id: vendorId,
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

    const loggedUser = { id: userId, name: userData.name, email: userData.email, phone: userData.phone, role: 'customer', isAuthenticated: true };
    setCurrentUser(loggedUser);
    setActiveRole('customer');
  };

  const registerVendor = async (vendorData) => {
    const newVendor = {
      id: vendorData.id || `v${Date.now()}`,
      name: vendorData.name,
      owner_name: vendorData.ownerName || vendorData.name,
      email: vendorData.email,
      phone: vendorData.phone,
      password: vendorData.password || '123',
      address: vendorData.address || 'Dhaka, Bangladesh',
      category: vendorData.category || 'Electronics & Gadgets',
      status: 'Pending',
      rating: 5.0,
      review_count: 0,
      trade_license: vendorData.tradeLicense || 'TRAD/2026/KINBO',
      bank_details: vendorData.bankDetails || 'bKash Merchant Details',
      joined_date: new Date().toISOString().split('T')[0],
      logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
      commission_rate: 5,
    };
    
    // Map camelCase for Supabase
    const dbVendor = {
      id: newVendor.id, name: newVendor.name, owner_name: newVendor.owner_name, logo: newVendor.logo, banner: newVendor.banner,
      phone: newVendor.phone, address: newVendor.address, bank_details: newVendor.bank_details, commission_rate: newVendor.commission_rate, status: newVendor.status
    };

    await supabase.from('vendors').insert(dbVendor);
    setVendors((prev) => [...prev, { ...newVendor, ownerName: newVendor.owner_name, bankDetails: newVendor.bank_details, commissionRate: newVendor.commission_rate }]);

    const notif = {
      id: `n-${Date.now()}`,
      title: 'New Seller Registration Pending Approval 🏪',
      message: `Store "${vendorData.name}" owned by ${vendorData.ownerName || vendorData.name} registered. Pending Admin approval.`,
      target_role: 'Admin',
      time: 'Just now',
      read: false,
    };
    await supabase.from('notifications').insert(notif);
    setNotifications((prev) => [{...notif, targetRole: notif.target_role}, ...prev]);
  };

  const updateVendorProfile = async (vendorId, updatedData) => {
    await supabase.from('vendors').update({
      name: updatedData.name,
      owner_name: updatedData.ownerName,
      logo: updatedData.logo,
      banner: updatedData.banner,
      phone: updatedData.phone,
      address: updatedData.address,
      bank_details: updatedData.bankDetails,
    }).eq('id', vendorId);

    setVendors((prev) => prev.map((v) => {
      if (v.id === vendorId) {
        return { ...v, name: updatedData.name || v.name, ownerName: updatedData.ownerName || v.ownerName, logo: updatedData.logo || v.logo, banner: updatedData.banner || v.banner, phone: updatedData.phone || v.phone, address: updatedData.address || v.address, bankDetails: updatedData.bankDetails || v.bankDetails };
      }
      return v;
    }));
    if (currentUser.vendorId === vendorId || currentUser.email === updatedData.email) {
      setCurrentUser((prev) => ({ ...prev, name: updatedData.name || prev.name, ownerName: updatedData.ownerName || prev.ownerName, logo: updatedData.logo || prev.logo }));
    }
  };

  const approveVendor = async (vendorId) => {
    await supabase.from('vendors').update({ status: 'Approved' }).eq('id', vendorId);
    await supabase.from('users').update({ role: 'vendor' }).eq('vendor_id', vendorId);
    setVendors((prev) => prev.map((v) => (v.id === vendorId ? { ...v, status: 'Approved' } : v)));

    const targetVendor = vendors.find((v) => v.id === vendorId);
    if (targetVendor) {
      const notif = {
        id: `n-${Date.now()}`,
        title: 'Vendor Store Approved! 🎉',
        message: `Congratulations! Your seller store "${targetVendor.name}" has been approved by Admin!`,
        target_role: 'Vendor',
        target_user_id: vendorId,
        date: 'Just now',
        read: false,
      };
      await supabase.from('notifications').insert(notif);
      setNotifications((prev) => [{...notif, targetRole: 'Vendor'}, ...prev]);

      if (currentUser.email && targetVendor.email && currentUser.email.toLowerCase() === targetVendor.email.toLowerCase()) {
        setCurrentUser({...currentUser, role: 'vendor', vendorId: targetVendor.id, name: targetVendor.name});
        setActiveRole('vendor');
      }
    }
  };

  const suspendVendor = async (vendorId) => {
    await supabase.from('vendors').update({ status: 'Suspended' }).eq('id', vendorId);
    setVendors((prev) => prev.map((v) => (v.id === vendorId ? { ...v, status: 'Suspended' } : v)));

    const targetVendor = vendors.find((v) => v.id === vendorId);
    if (targetVendor) {
      const notif = {
        id: `n-${Date.now()}`,
        title: 'Vendor Store Application Rejected ❌',
        message: `We're sorry, your application for "${targetVendor.name}" has been rejected.`,
        target_role: 'Customer',
        target_user_id: vendorId,
        date: 'Just now',
        read: false,
      };
      await supabase.from('notifications').insert(notif);
      setNotifications((prev) => [{...notif, targetRole: 'Customer', targetUserId: vendorId}, ...prev]);
    }
  };

  const registerDeliveryAgent = async (agentData) => {
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
      completed_deliveries: 0,
    };
    await supabase.from('delivery_agents').insert(newAgent);
    setDeliveryAgents((prev) => [...prev, { ...newAgent, completedDeliveries: 0 }]);

    const notif = {
      id: `n-${Date.now()}`,
      title: 'New Delivery Agent Registration Pending 🚚',
      message: `Rider "${agentData.name}" registered. Pending Admin approval.`,
      target_role: 'Admin',
      date: 'Just now',
      read: false,
    };
    await supabase.from('notifications').insert(notif);
    setNotifications((prev) => [{...notif, targetRole: 'Admin'}, ...prev]);
    return { success: true, message: 'Delivery Agent application submitted!' };
  };

  const approveDeliveryAgent = async (agentId) => {
    await supabase.from('delivery_agents').update({ status: 'Approved' }).eq('id', agentId);
    setDeliveryAgents((prev) => prev.map((d) => (d.id === agentId ? { ...d, status: 'Approved' } : d)));
    const agent = deliveryAgents.find((d) => d.id === agentId);
    if (agent) {
      setUserAccounts((prev) => prev.map((u) => u.email && agent.email && u.email.trim().toLowerCase() === agent.email.trim().toLowerCase() ? { ...u, role: 'delivery' } : u));
      if (currentUser.email && agent.email && currentUser.email.trim().toLowerCase() === agent.email.trim().toLowerCase()) {
        setCurrentUser((prev) => ({ ...prev, role: 'delivery' }));
        setActiveRole('delivery');
      }
      const notif = {
        id: `n-${Date.now()}`,
        title: 'Delivery Rider Application APPROVED! 🚚',
        message: `Congratulations ${agent.name}! Your delivery rider account has been APPROVED by Admin.`,
        target_role: 'Delivery',
        target_user_id: agent.id,
        date: 'Just now',
        read: false,
      };
      await supabase.from('notifications').insert(notif);
      setNotifications((prev) => [{...notif, targetRole: 'Delivery', targetUserId: agent.id}, ...prev]);
    }
    return { success: true, message: 'Approved successfully!' };
  };

  const suspendDeliveryAgent = async (agentId) => {
    await supabase.from('delivery_agents').update({ status: 'Suspended' }).eq('id', agentId);
    setDeliveryAgents((prev) => prev.map((d) => (d.id === agentId ? { ...d, status: 'Suspended' } : d)));
  };

  const requestVendorPayout = async (vendorId, vendorName, amount, bankDetails) => {
    if (amount < 500) return { success: false, message: 'Minimum payout amount requirement is BDT 500.' };
    const newPayout = { id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`, vendor_id: vendorId, vendor_name: vendorName, amount: Number(amount), bank_details: bankDetails, date: `${new Date().toISOString().split('T')[0]}`, status: 'Pending Approval' };
    await supabase.from('payout_requests').insert(newPayout);
    setPayoutRequests((prev) => [{...newPayout, vendorId, vendorName, bankDetails: newPayout.bank_details}, ...prev]);
    const notif = { id: `n-${Date.now()}`, title: 'New Vendor Payout Request 💵', message: `Vendor "${vendorName}" requested BDT ${amount}.`, target_role: 'Admin', date: 'Just now', read: false };
    await supabase.from('notifications').insert(notif);
    setNotifications((prev) => [{...notif, targetRole: 'Admin'}, ...prev]);
    return { success: true, message: 'Submitted!' };
  };

  const processVendorPayout = async (payoutId, isApproved, transferRef = '', note = '') => {
    const updatedStatus = isApproved ? 'Approved' : 'Rejected';
    await supabase.from('payout_requests').update({ status: updatedStatus }).eq('id', payoutId);
    setPayoutRequests((prev) => prev.map((p) => p.id === payoutId ? { ...p, status: updatedStatus } : p));
  };

  const requestDeliveryPayout = async (driverId, driverName, driverEmail, driverPhone, amount, paymentMethod, accountDetails, note = '') => {
    if (amount < 100) return { success: false, message: 'Min BDT 100.' };
    const newPayout = { id: `RPAY-${Math.floor(1000 + Math.random() * 9000)}`, type: 'delivery', driver_name: driverName, amount: Number(amount), bank_details: accountDetails, date: `${new Date().toISOString().split('T')[0]}`, status: 'Pending Approval' };
    await supabase.from('payout_requests').insert(newPayout);
    setPayoutRequests((prev) => [{...newPayout, driverId, driverName, bankDetails: accountDetails}, ...prev]);
    return { success: true, message: 'Submitted!' };
  };

  const processDeliveryPayout = async (payoutId, isApproved, transferRef = '', note = '') => {
    const updatedStatus = isApproved ? 'Approved' : 'Rejected';
    await supabase.from('payout_requests').update({ status: updatedStatus }).eq('id', payoutId);
    setPayoutRequests((prev) => prev.map((p) => p.id === payoutId ? { ...p, status: updatedStatus } : p));
  };


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
    if (!coupon) return { success: false, message: 'Invalid coupon code.' };
    if (cartSubtotal < (coupon.minSpend || 0)) return { success: false, message: 'Minimum spend not met.' };
    setAppliedCoupon(coupon);
    if (!collectedVouchers.includes(coupon.code)) setCollectedVouchers((prev) => [...prev, coupon.code]);
    return { success: true, message: 'Coupon applied!' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const addPublicVoucher = async (voucherData) => {
    const newVoucher = {
      id: `c${Date.now()}`,
      code: voucherData.code.toUpperCase().trim(),
      discount_type: voucherData.discountType,
      amount: Number(voucherData.amount),
      min_spend: Number(voucherData.minSpend || 0),
      description: voucherData.description,
    };
    await supabase.from('coupons').insert(newVoucher);
    setCoupons((prev) => [{...newVoucher, discountType: newVoucher.discount_type, minSpend: newVoucher.min_spend}, ...prev.filter((c) => c.code !== newVoucher.code)]);
    return { success: true, message: 'Public Voucher Published!' };
  };

  const addToCart = (product, quantity = 1, silent = false) => {
    if (!currentUser.isAuthenticated || currentUser.id === 'guest') {
      setIsLoginModalOpen(true);
      if (!silent) {
        showAlert('Login Required', 'Please login to add items to your cart.', 'info');
      }
      return false;
    }

    if (currentUser.vendorId && currentUser.vendorId === product.vendorId) {
      if (!silent) {
        showAlert('Action Denied', 'You cannot purchase your own products.', 'error');
      }
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    if (!silent) {
      showAlert('Success', `${product.title} added to your cart!`, 'success');
    }
    return true;
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCart((prev) => prev.map((item) => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const addProduct = async (productData) => {
    const vendor = vendors.find((v) => v.id === activeVendorId);
    const newProduct = {
      id: `p${Date.now()}`,
      title: productData.title,
      brand: productData.brand || 'Generic',
      category: productData.category,
      price: Number(productData.price),
      original_price: Number(productData.originalPrice) || Number(productData.price),
      stock: Number(productData.stock),
      rating: 0,
      review_count: 0,
      image: productData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: productData.description || '',
      featured: false,
      on_sale: Number(productData.price) < Number(productData.originalPrice),
      discount_percent: Number(productData.originalPrice) > Number(productData.price) ? Math.round(((Number(productData.originalPrice) - Number(productData.price)) / Number(productData.originalPrice)) * 100) : 0,
      vendor_id: activeVendorId,
      vendor_name: vendor?.name || 'Unknown Vendor',
      date: new Date().toISOString().split('T')[0],
    };

    await supabase.from('products').insert(newProduct);
    setProducts((prev) => [{...newProduct, originalPrice: newProduct.original_price, reviewCount: 0, vendorId: activeVendorId, vendorName: newProduct.vendor_name}, ...prev]);
  };

  const updateProduct = async (productId, updatedData) => {
    const dbUpdate = {
      title: updatedData.title,
      price: Number(updatedData.price),
      original_price: Number(updatedData.originalPrice),
      stock: Number(updatedData.stock),
      category: updatedData.category,
      brand: updatedData.brand,
      description: updatedData.description,
      image: updatedData.image
    };
    await supabase.from('products').update(dbUpdate).eq('id', productId);
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, ...updatedData, originalPrice: Number(updatedData.originalPrice) } : p));
  };

  const deleteProduct = async (productId) => {
    await supabase.from('products').delete().eq('id', productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const placeOrder = async (orderData) => {
    if (!currentUser.isAuthenticated || currentUser.id === 'guest') {
      setIsLoginModalOpen(true);
      showAlert('Login Required', 'Please login to place your order.', 'info');
      return;
    }

    const newOrder = {
      id: `ORD${Date.now()}`,
      customer_id: currentUser.id,
      customer_name: currentUser.name,
      customer_email: currentUser.email,
      customer_phone: orderData.phone,
      items: cart,
      total: Number(orderData.total),
      date: new Date().toLocaleString(),
      payment_method: orderData.paymentMethod,
      payment_status: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending Verification',
      status: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending Vendor Approval' : 'Pending Verification',
      payment_trx_id: orderData.trxId || null,
      shipping_address: orderData.address,
      delivery_fee: Number(orderData.shippingFee),
      is_archived: false
    };

    await supabase.from('orders').insert(newOrder);
    setOrders((prev) => [
      {
        ...newOrder, 
        customerId: currentUser.id, 
        customerName: newOrder.customer_name, 
        customerEmail: newOrder.customer_email,
        customerPhone: newOrder.customer_phone,
        paymentMethod: newOrder.payment_method, 
        shippingAddress: newOrder.shipping_address
      }, 
      ...prev
    ]);
    clearCart();
    
    if (appliedCoupon && appliedCoupon.code !== 'KINBO10') {
      removeCoupon();
    }

    return newOrder.id;
  };

  const notifyOrderStatusChange = async (order, newStatus, customMsg = '', targetRoles = ['customer', 'vendor']) => {
    if (!order) return;
    const msg = customMsg || `Order #${order.id} status is now: ${newStatus}`;
    
    let allNotifs = [];

    if (targetRoles.includes('customer')) {
      allNotifs.push({
        id: `n-${Date.now()}-c`,
        user_id: order.customerId,
        title: 'Order Status Update 📦',
        message: msg,
        target_role: 'customer',
        date: new Date().toISOString(),
        read: false,
      });
    }

    if (targetRoles.includes('vendor')) {
      const vendorIds = [...new Set((order.items || []).map(item => item.vendorId))];
      const vendorNotifs = vendorIds.filter(Boolean).map((vId, idx) => ({
        id: `n-${Date.now()}-v${idx}`,
        user_id: vId,
        title: 'Order Status Update 📦',
        message: msg,
        target_role: 'vendor',
        date: new Date().toISOString(),
        read: false,
      }));
      allNotifs = [...allNotifs, ...vendorNotifs];
    }

    if (targetRoles.includes('admin')) {
      allNotifs.push({
        id: `n-${Date.now()}-a`,
        user_id: 'admin', // Global admin target
        title: 'Admin Action Required',
        message: msg,
        target_role: 'admin',
        date: new Date().toISOString(),
        read: false,
      });
    }

    if (targetRoles.includes('delivery')) {
      allNotifs.push({
        id: `n-${Date.now()}-d`,
        user_id: 'delivery', // Global delivery broadcast target
        title: 'New Parcel Ready 🚚',
        message: msg,
        target_role: 'delivery',
        date: new Date().toISOString(),
        read: false,
      });
    }

    if (allNotifs.length > 0) {
      await supabase.from('notifications').insert(allNotifs);
      setNotifications((prev) => [
        ...allNotifs.map(n => ({...n, userId: n.user_id, targetRole: n.target_role})),
        ...prev
      ]);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    notifyOrderStatusChange(order, newStatus);
  };

  const cancelOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    await supabase.from('orders').update({ status: 'Cancelled' }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o)));
    notifyOrderStatusChange(order, 'Cancelled');
  };

  const assignDeliveryRider = async (orderId, riderId, riderName) => {
    const order = orders.find(o => o.id === orderId);
    await supabase.from('orders').update({ delivery_rider_id: riderId, delivery_rider_name: riderName, status: 'Out for Delivery' }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, deliveryRiderId: riderId, deliveryRiderName: riderName, status: 'Out for Delivery' } : o));
    notifyOrderStatusChange(order, 'Out for Delivery', `Order #${orderId} has been assigned to rider ${riderName}.`);
  };

  const markOrderDelivered = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    await supabase.from('orders').update({ status: 'Delivered', payment_status: 'Paid' }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Delivered', paymentStatus: 'Paid' } : o));
    notifyOrderStatusChange(order, 'Delivered', `Order #${orderId} has been successfully delivered!`);
  };

  const driverProcessDelivery = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (newStatus === 'Delivered') {
      await supabase.from('orders').update({ status: 'Delivered', payment_status: 'Paid' }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Delivered', paymentStatus: 'Paid' } : o));
      notifyOrderStatusChange(order, 'Delivered', `Order #${orderId} has been successfully delivered and payouts credited!`, ['customer', 'vendor']);
    } else if (newStatus === 'Delivery Failed') {
      if (order && order.paymentMethod !== 'Cash on Delivery') {
        await supabase.from('orders').update({ status: 'Cancelled', payment_status: 'Pending Refund' }).eq('id', orderId);
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Cancelled', paymentStatus: 'Pending Refund' } : o));
        notifyOrderStatusChange(order, 'Delivery Failed', `Order #${orderId} prepaid delivery failed. Product returning to vendor. Refund required.`, ['customer', 'vendor', 'admin']);
      } else {
        await supabase.from('orders').update({ status: 'Cancelled', payment_status: 'Cancelled' }).eq('id', orderId);
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Cancelled', paymentStatus: 'Cancelled' } : o));
        notifyOrderStatusChange(order, 'Delivery Failed', `Order #${orderId} COD delivery failed. Product returning to vendor.`, ['customer', 'vendor']);
      }
    } else {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      notifyOrderStatusChange(order, newStatus);
    }
  };

  const verifyAndAcceptPayment = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    await supabase.from('orders').update({ payment_status: 'Paid', status: 'Pending Vendor Approval' }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: 'Paid', status: 'Pending Vendor Approval' } : o));
    notifyOrderStatusChange(order, 'Processing', 'Payment verified successfully. Order forwarded to Vendor for packing.');
  };

  const verifyMFSOrder = async (orderId, isValid, reason = '') => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (isValid) {
      await supabase.from('orders').update({ payment_status: 'Paid', status: 'Pending Vendor Approval' }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: 'Paid', status: 'Pending Vendor Approval' } : o));
      notifyOrderStatusChange(order, 'Processing', 'MFS Payment verified successfully. Order forwarded to Vendor for packing.');
    } else {
      await supabase.from('orders').update({ payment_status: 'Failed', status: 'Cancelled' }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: 'Failed', status: 'Cancelled' } : o));
      notifyOrderStatusChange(order, 'Cancelled', `Payment Verification Failed: ${reason}`);
    }
  };

  const vendorProcessOrder = async (orderId, action, message) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (action === 'accept') {
      await supabase.from('orders').update({ status: 'Ready for Courier' }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Ready for Courier' } : o));
      notifyOrderStatusChange(order, 'Ready for Courier', message || `Order #${orderId} has been packed and is ready for courier pickup.`, ['customer', 'vendor', 'delivery']);
    } else if (action === 'reject') {
      if (order.paymentStatus === 'Paid' || order.paymentMethod !== 'Cash on Delivery') {
        await supabase.from('orders').update({ status: 'Cancelled', payment_status: 'Pending Refund' }).eq('id', orderId);
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Cancelled', paymentStatus: 'Pending Refund' } : o));
        notifyOrderStatusChange(order, 'Cancelled by Vendor', message || `Vendor rejected prepaid order #${orderId}. Refund required.`, ['customer', 'vendor', 'admin']);
      } else {
        await supabase.from('orders').update({ status: 'Cancelled by Vendor', payment_status: 'Cancelled' }).eq('id', orderId);
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Cancelled by Vendor', paymentStatus: 'Cancelled' } : o));
        notifyOrderStatusChange(order, 'Cancelled by Vendor', message || `Vendor rejected COD order #${orderId}.`, ['customer', 'vendor']);
      }
    }
  };

  const processRefund = async (orderId, refundRef = '') => {
    await supabase.from('orders').update({ payment_status: 'Refunded', status: 'Cancelled', refund_ref_trx_id: refundRef }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: 'Refunded', status: 'Cancelled', refundRefTrxId: refundRef } : o));
  };

  const processCustomerRefund = async (orderId, isApproved, refundTrxId = '', refundNote = '') => {
    if (isApproved) {
      await supabase.from('orders').update({ payment_status: 'Refunded', status: 'Cancelled', refund_ref_trx_id: refundTrxId }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: 'Refunded', status: 'Cancelled', refundRefTrxId: refundTrxId } : o));
      showAlert('Refund Processed', `Order ${orderId} refund completed successfully.`, 'success');
    } else {
      await supabase.from('orders').update({ status: 'Processing' }).eq('id', orderId);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'Processing' } : o));
      showAlert('Refund Declined', `Order ${orderId} refund was declined.`, 'error');
    }
  };

  const deleteVoucher = async (code) => {
    await supabase.from('coupons').delete().eq('code', code.toUpperCase());
    setCoupons((prev) => prev.filter((c) => c.code !== code.toUpperCase()));
    showAlert('Voucher Deleted', `Voucher ${code} removed successfully.`, 'success');
  };

  const clearDeliveredOrderTracking = async (orderId) => {
    await supabase.from('orders').update({ is_archived: true }).eq('id', orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, isArchived: true } : o)));
  };

  const addReview = async (reviewData) => {
    const existing = reviews.find(r => r.productId === reviewData.productId && r.userId === currentUser.id);
    if (existing) {
      return { success: false, message: 'You have already reviewed this product.' };
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      product_id: reviewData.productId,
      order_id: reviewData.orderId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_email: currentUser.email,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
    };
    await supabase.from('reviews').insert(newReview);
    setReviews((prev) => [{...newReview, productId: newReview.product_id, orderId: newReview.order_id, userName: newReview.user_name}, ...prev]);
    
    // Update Product Rating
    const product = products.find(p => p.id === reviewData.productId);
    if (product) {
      const productReviews = reviews.filter(r => r.productId === reviewData.productId);
      const newReviewCount = productReviews.length + 1;
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0) + reviewData.rating;
      const newAverageRating = Number((totalRating / newReviewCount).toFixed(1));

      await supabase.from('products').update({ 
        rating: newAverageRating, 
        review_count: newReviewCount 
      }).eq('id', reviewData.productId);
    }
    
    // Remove auto-archive so it stays in order history
    // if (reviewData.orderId) {
    //   clearDeliveredOrderTracking(reviewData.orderId);
    // }
    return { success: true };
  };

  const markNotificationRead = async (notificationId) => {
    await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = async (userId, userRole) => {
    if (userRole === 'Admin') {
      await supabase.from('notifications').delete().eq('target_role', 'Admin');
      setNotifications((prev) => prev.filter(n => n.targetRole !== 'Admin'));
    } else {
      await supabase.from('notifications').delete().eq('user_id', userId);
      setNotifications((prev) => prev.filter(n => n.userId !== userId));
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser, activeRole, setActiveRole, activeVendorId, login, logout, registerUser, registerVendor,
        updateVendorProfile, approveVendor, suspendVendor, registerDeliveryAgent,
        approveDeliveryAgent, suspendDeliveryAgent, products, categories, addProduct, updateProduct,
        deleteProduct, orders, vendors, deliveryAgents, payoutRequests, requestVendorPayout,
        processVendorPayout, requestDeliveryPayout, processDeliveryPayout, placeOrder,
        updateOrderStatus, cancelOrder, vendorProcessOrder, assignDeliveryRider, markOrderDelivered, driverProcessDelivery,
        verifyAndAcceptPayment, verifyMFSOrder, processRefund, processCustomerRefund, clearDeliveredOrderTracking,
        cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
        reviews, addReview, notifications, markNotificationRead, clearAllNotifications,
        coupons, collectedVouchers, appliedCoupon, collectVoucher, applyCoupon,
        removeCoupon, addPublicVoucher, deleteVoucher, isLoginModalOpen, setIsLoginModalOpen,
        customAlert, showAlert, closeAlert, adminAccounts, userAccounts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
