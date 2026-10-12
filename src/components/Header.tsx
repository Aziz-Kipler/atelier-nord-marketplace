import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Search,
  ShoppingBag,
  Bookmark,
  User,
  Sun,
  Moon,
  Menu,
  Shield,
  Layers,
  Plus,
} from 'lucide-react';
import { Category } from '../types/index.ts';

export const Header: React.FC = () => {
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
    cartCount,
    wishlist,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    setSelectedCategoryFilter,
    openPublishModal,
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategoryFilter(category);
    setPage('catalog');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors overflow-hidden">
      {/* Top Notice / Announcement Bar */}
      <div className="w-full bg-zinc-900 text-zinc-300 text-[11px] py-1.5 px-3 text-center tracking-wider uppercase font-medium border-b border-zinc-800 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-xs overflow-hidden">
          <span className="truncate max-w-[260px] sm:max-w-none">{t.tagline}</span>
          <span aria-hidden="true" className="hidden sm:inline text-zinc-600">·</span>
          <span className="text-zinc-400 hidden sm:inline truncate">Бесплатная доставка от 15 000 ₽</span>
          <span aria-hidden="true" className="hidden md:inline text-zinc-600">·</span>
          <span className="hidden md:inline text-amber-400 font-mono">CODE: NORD15 (-15%)</span>
        </div>
      </div>

      {/* Main Top Bar adhering strictly to Top Bar Contract */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6 overflow-hidden">
        {/* Left: Mobile hamburger + Zone 1 Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1.5 sm:p-2 -ml-1 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setPage('home')}
            className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity cursor-pointer"
          >
            {t.brandName}
          </button>
        </div>

        {/* Zone 2: Clean single-line nav links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
          <button
            onClick={() => handleCategoryClick('clothing')}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navClothing}
          </button>
          <button
            onClick={() => handleCategoryClick('footwear')}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navFootwear}
          </button>
          <button
            onClick={() => handleCategoryClick('headwear')}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navHeadwear}
          </button>
          <button
            onClick={() => handleCategoryClick('accessories')}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navAccessories}
          </button>
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setPage('catalog');
            }}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.navCatalog}
          </button>
        </nav>

        {/* Zone 3: Interactive Controls (Search, Role, Lang, Theme, Wishlist, Cart, Profile) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Quick Search Bar trigger */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  className="w-36 sm:w-56 py-1.5 pl-3 pr-8 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title={t.searchAction}
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Publish Product button (Ozon-style seller CTA) */}
          <button
            onClick={() => openPublishModal(null)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
            title="Опубликовать свой товар"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Продать</span>
          </button>

          {/* Quick Role Switcher Button (RBAC) */}
          <button
            onClick={() => {
              const nextRole = role === 'buyer' ? 'admin' : 'buyer';
              setRole(nextRole);
              setPage(nextRole === 'admin' ? 'admin_dashboard' : 'home');
            }}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
              role === 'admin'
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
            title={t.switchRole}
          >
            {role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
            <span>{role === 'admin' ? t.roleAdmin : t.roleCustomer}</span>
          </button>

          {/* Language Switcher (RU / EN) */}
          <button
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
            className="px-1.5 sm:px-2 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t.language}
          >
            {language.toUpperCase()}
          </button>

          {/* Dark / Light Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setPage('wishlist')}
            className="relative p-1.5 sm:p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t.navWishlist}
          >
            <Bookmark className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-mono font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart / Bag Button */}
          <button
            onClick={() => setPage('cart')}
            className="relative p-1.5 sm:p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t.navCart}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-mono font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile / Account Button */}
          <button
            onClick={() => setPage(role === 'admin' ? 'admin_dashboard' : 'profile')}
            className="p-1.5 sm:p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={role === 'admin' ? t.adminPanel : t.account}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
