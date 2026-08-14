import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { CustomerView } from './views/CustomerView';
import { VendorView } from './views/VendorView';
import { AdminView } from './views/AdminView';
import { DeliveryView } from './views/DeliveryView';

import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { VendorRegisterModal } from './components/VendorRegisterModal';
import { LoginModal } from './components/LoginModal';
import { VoucherDrawer } from './components/VoucherDrawer';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomAlertModal } from './components/CustomAlertModal';

const MainAppContent = () => {
  const { activeRole, setActiveRole, isLoginModalOpen, setIsLoginModalOpen, customAlert, closeAlert } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchSelectedProduct, setSearchSelectedProduct] = useState(null);

  const [showSplash, setShowSplash] = useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRegisterVendorOpen, setIsRegisterVendorOpen] = useState(false);
  const [isVouchersOpen, setIsVouchersOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  if (showSplash) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999, background: 'var(--bg-main)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <img 
          src="/kinbo-logo.png" 
          alt="Kinbo" 
          style={{ width: '180px', animation: 'pulse 1.5s infinite ease-in-out' }} 
        />
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.5; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.5; transform: scale(0.95); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Kinbo Header Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRegisterVendor={() => setIsRegisterVendorOpen(true)}
        onOpenVouchers={() => setIsVouchersOpen(true)}
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
        onSelectProduct={(prod) => setSearchSelectedProduct(prod)}
      />

      {/* Dynamic Persona View */}
      <main className="main-content">
        {activeRole === 'customer' && (
          <CustomerView
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onOpenCart={() => setIsCartOpen(true)}
            onBuyNow={() => setIsCheckoutOpen(true)}
          />
        )}

        {activeRole === 'vendor' && <VendorView />}

        {activeRole === 'admin' && <AdminView />}

        {activeRole === 'delivery' && <DeliveryView />}
      </main>

      {/* Global Modals & Drawers */}
      {searchSelectedProduct && (
        <ProductDetailModal
          product={searchSelectedProduct}
          onClose={() => setSearchSelectedProduct(null)}
          onOpenCart={() => setIsCartOpen(true)}
          onBuyNow={() => {
            setSearchSelectedProduct(null);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccessOrder={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(false);
        }}
      />

      <VendorRegisterModal
        isOpen={isRegisterVendorOpen}
        onClose={() => setIsRegisterVendorOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <VoucherDrawer
        isOpen={isVouchersOpen}
        onClose={() => setIsVouchersOpen(false)}
      />

      <SideMenuDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenVouchers={() => setIsVouchersOpen(true)}
        onOpenRegisterVendor={() => setIsRegisterVendorOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setActiveRole('customer');
        }}
      />

      <CustomAlertModal
        isOpen={customAlert.isOpen}
        title={customAlert.title}
        message={customAlert.message}
        type={customAlert.type}
        onClose={closeAlert}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Click for error details</summary>
            <br />
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <MainAppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}
