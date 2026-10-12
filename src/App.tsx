import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { CatalogPage } from './pages/CatalogPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { CustomerDashboard } from './pages/CustomerDashboard.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { AdminProducts } from './pages/AdminProducts.tsx';
import { AdminCustomers } from './pages/AdminCustomers.tsx';
import { AdminOrders } from './pages/AdminOrders.tsx';
import { PublishProductModal } from './components/PublishProductModal.tsx';

function MainRouter() {
  const { page, isPublishModalOpen, setIsPublishModalOpen, productToEdit } = useApp();

  const renderCurrentPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'product_detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'profile':
        return <ProfilePage />;
      case 'customer_dashboard':
        return <CustomerDashboard />;
      case 'login':
        return <LoginPage />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'admin_products':
        return <AdminProducts />;
      case 'admin_customers':
        return <AdminCustomers />;
      case 'admin_orders':
        return <AdminOrders />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 font-sans antialiased">
      {/* Top Header */}
      <Header />

      {/* Slide-out Navigation Drawer */}
      <Sidebar />

      {/* Primary Page Canvas */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Unified Footer */}
      <Footer />

      {/* Global Multi-Photo Product Publishing Modal */}
      <PublishProductModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
