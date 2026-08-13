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

const MainAppContent = () => {
  const { activeRole, setActiveRole, isLoginModalOpen, setIsLoginModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchSelectedProduct, setSearchSelectedProduct] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRegisterVendorOpen, setIsRegisterVendorOpen] = useState(false);
  const [isVouchersOpen, setIsVouchersOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
