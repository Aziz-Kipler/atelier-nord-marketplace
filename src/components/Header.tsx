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
  Download,
  Code2,
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
  const [exportModalOpen, setExportModalOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Top Notice / Announcement Bar */}
      <div className="bg-zinc-900 dark:bg-zinc-900 text-zinc-300 text-[11px] py-1 px-4 text-center tracking-wider uppercase font-medium border-b border-zinc-800 flex items-center justify-center gap-3">
        <span>{t.tagline}</span>
        <span aria-hidden="true">·</span>
        <span className="text-zinc-400">Бесплатная курьерская доставка от 15 000 ₽ / $150</span>
        <span aria-hidden="true" className="hidden sm:inline">·</span>
        <span className="hidden sm:inline text-amber-400 font-mono">CODE: NORD15 (-15%)</span>
      </div>

      {/* Main Top Bar adhering strictly to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Left: Mobile hamburger + Zone 1 Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setPage('home')}
            className="text-lg md:text-xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity cursor-pointer"
          >
            {t.brandName}
          </button>
        </div>

        {/* Zone 2: Clean single-line nav links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
          <button
            onClick={() => handleCategoryClick('clothing')}
            className={`hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              page === 'catalog' ? '' : ''
            }`}
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                  className="w-48 sm:w-64 py-1.5 pl-3 pr-8 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white transition-all"
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
                className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title={t.searchAction}
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Publish Product button (Ozon-style seller CTA) */}
          <button
            onClick={() => openPublishModal(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
            title="Опубликовать свой товар"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Продать товар</span>
            <span className="sm:hidden">Продать</span>
          </button>

          {/* Quick Role Switcher Button (RBAC) */}
          <button
            onClick={() => {
              const nextRole = role === 'buyer' ? 'admin' : 'buyer';
              setRole(nextRole);
              setPage(nextRole === 'admin' ? 'admin_dashboard' : 'home');
            }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
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
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t.language}
          >
            {language.toUpperCase()}
          </button>

          {/* Dark / Light Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setPage('wishlist')}
            className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
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
            className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t.navCart}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-mono font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Download / Export Code Button */}
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-98"
            title="Скачать весь исходный код проекта (ZIP)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Скачать код</span>
            <span className="md:hidden">Код</span>
          </button>

          {/* Profile / Account Button */}
          <button
            onClick={() => setPage(role === 'admin' ? 'admin_dashboard' : 'profile')}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={role === 'admin' ? t.adminPanel : t.account}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Export / GitHub Code Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold">Исходный код проекта</h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Вы можете скачать весь проект одним архивом <strong>.ZIP</strong> или перенести его прямо в свой GitHub профиль <strong>Aziz-Kipler</strong>.
            </p>

            {/* Direct Download Button */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  Готовый ZIP-архив со всеми файлами
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  Включает React, TypeScript, Tailwind, все страницы, компоненты и картинки.
                </div>
              </div>
              <a
                href="/atelier-nord-marketplace.zip"
                download="atelier-nord-marketplace.zip"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all shrink-0 cursor-pointer text-center"
              >
                <Download className="w-4 h-4" />
                Скачать .ZIP
              </a>
            </div>

            {/* GitHub Push Instructions */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Как загрузить в репозиторий GitHub (Aziz-Kipler)
              </div>
              <div className="p-3 bg-zinc-950 text-zinc-200 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                <div className="text-zinc-500"># 1. Создайте пустой репозиторий на github.com/new</div>
                <div className="text-emerald-400">git remote add origin https://github.com/Aziz-Kipler/atelier-nord-marketplace.git</div>
                <div className="text-emerald-400">git branch -M main</div>
                <div className="text-emerald-400">git push -u origin main</div>
              </div>
            </div>

            <div className="text-xs text-zinc-500 space-y-1">
              <div>✓ Git репозиторий уже инициализирован на ветку <code className="text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">main</code>.</div>
              <div>✓ Автор коммитов настроен: <code className="text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">Aziz-Kipler</code>.</div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
