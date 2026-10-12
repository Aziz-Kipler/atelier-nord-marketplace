import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Home,
  ShoppingBag,
  Bookmark,
  User,
  Shield,
  Layers,
  BarChart3,
  Package,
  Users,
  ClipboardList,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Category } from '../types/index.ts';

export const Sidebar: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    theme,
    toggleTheme,
    role,
    setRole,
    page,
    setPage,
    currentUser,
    isSidebarOpen,
    setIsSidebarOpen,
    cartCount,
    wishlist,
    setSelectedCategoryFilter,
    openPublishModal,
  } = useApp();

  if (!isSidebarOpen) return null;

  const navigateAndClose = (newPage: typeof page) => {
    setPage(newPage);
    setIsSidebarOpen(false);
  };

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategoryFilter(cat);
    navigateAndClose('catalog');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
              Navigation
            </div>
            <div className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
              {t.brandName}
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RBAC Role Switcher Card */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800">
          <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{t.currentRole}</span>
            <span className="font-mono text-[10px] text-amber-500">RBAC ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg">
            <button
              onClick={() => {
                setRole('buyer');
                setPage('home');
              }}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'buyer'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.roleCustomer}</span>
            </button>

            <button
              onClick={() => {
                setRole('admin');
                setPage('admin_dashboard');
              }}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'admin'
                  ? 'bg-white dark:bg-zinc-900 text-amber-500 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.roleAdmin}</span>
            </button>
          </div>

          {/* Quick Publish Product Button in Sidebar */}
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              openPublishModal(null);
            }}
            className="w-full mt-3 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Опубликовать свой товар</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-4 space-y-6">
          {/* If ADMIN role is active */}
          {role === 'admin' ? (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 px-3 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>{t.adminPanel}</span>
              </div>

              <button
                onClick={() => navigateAndClose('admin_dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  page === 'admin_dashboard'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{t.navAdminDashboard}</span>
              </button>

              <button
                onClick={() => navigateAndClose('admin_products')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  page === 'admin_products'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{t.navAdminProducts}</span>
              </button>

              <button
                onClick={() => navigateAndClose('admin_customers')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  page === 'admin_customers'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{t.navAdminCustomers}</span>
              </button>

              <button
                onClick={() => navigateAndClose('admin_orders')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  page === 'admin_orders'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>{t.navAdminOrders}</span>
              </button>
            </div>
          ) : (
            /* If CUSTOMER role is active */
            <>
              {/* Main Links */}
              <div className="space-y-1">
                <button
                  onClick={() => navigateAndClose('home')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    page === 'home'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>{t.navHome}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategoryFilter('all');
                    navigateAndClose('catalog');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    page === 'catalog'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.navCatalog}</span>
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-1 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-3 mb-1">
                  {t.allCategories}
                </div>
                <button
                  onClick={() => handleCategoryClick('clothing')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <span>{t.navClothing}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>
                <button
                  onClick={() => handleCategoryClick('footwear')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <span>{t.navFootwear}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>
                <button
                  onClick={() => handleCategoryClick('headwear')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <span>{t.navHeadwear}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>
                <button
                  onClick={() => handleCategoryClick('accessories')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <span>{t.navAccessories}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>

              {/* Customer Account shortcuts */}
              <div className="space-y-1 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-3 mb-1">
                  {t.account}
                </div>
                <button
                  onClick={() => navigateAndClose('customer_dashboard')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{t.navCustomerDashboard}</span>
                </button>
                <button
                  onClick={() => navigateAndClose('profile')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{t.navProfile}</span>
                </button>
                <button
                  onClick={() => navigateAndClose('wishlist')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-4 h-4" />
                    <span>{t.navWishlist}</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="font-mono text-xs text-zinc-400">({wishlist.length})</span>
                  )}
                </button>
                <button
                  onClick={() => navigateAndClose('cart')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.navCart}</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="font-mono text-xs text-zinc-400">({cartCount})</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer info & user card */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-3">
          {/* Quick Language & Theme Switches */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-500">
              <span>{t.language}:</span>
              <button
                onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                className="font-mono font-bold text-zinc-900 dark:text-white px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
              >
                {language.toUpperCase()}
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* User profile capsule */}
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-xs uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-zinc-500 truncate">
                {currentUser.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
