import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Category } from '../types/index.ts';
import { SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    t,
    products,
    language,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'new'>('popular');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Available brands
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set);
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
          return false;
        }
        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }
        // In Stock filter
        if (inStockOnly && !p.inStock) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const titleRu = p.title.ru.toLowerCase();
          const titleEn = p.title.en.toLowerCase();
          const brand = p.brand.toLowerCase();
          const sku = p.sku.toLowerCase();
          if (
            !titleRu.includes(query) &&
            !titleEn.includes(query) &&
            !brand.includes(query) &&
            !sku.includes(query)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'new') return b.createdAt.localeCompare(a.createdAt);
        return b.rating - a.rating; // default popularity
      });
  }, [products, selectedCategoryFilter, selectedBrand, inStockOnly, searchQuery, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategoryFilter('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setSearchQuery('');
  };

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: t.allCategories },
    { id: 'clothing', label: t.navClothing },
    { id: 'footwear', label: t.navFootwear },
    { id: 'headwear', label: t.navHeadwear },
    { id: 'accessories', label: t.navAccessories },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* 1. Header with search status & breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-zinc-500 mb-1">
            {t.catalogTitle}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {selectedCategoryFilter === 'all'
              ? t.allCategories
              : categories.find((c) => c.id === selectedCategoryFilter)?.label}
          </h1>
          {searchQuery && (
            <p className="text-xs text-zinc-500 mt-1">
              Поиск по запросу: <strong className="text-zinc-900 dark:text-white">«{searchQuery}»</strong>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-zinc-500">
            {filteredProducts.length} {t.productsFound.toLowerCase()}
          </div>

          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Фильтры</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Filter Bar (Segmented Controls) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategoryFilter === cat.id
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Brand & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand select */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="py-1.5 px-3 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Все бренды</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* In Stock toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-950 focus:ring-0"
            />
            <span>{t.filterInStock}</span>
          </label>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="py-1.5 px-3 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer font-mono"
          >
            <option value="popular">{t.sortPopular}</option>
            <option value="price_asc">{t.sortPriceAsc}</option>
            <option value="price_desc">{t.sortPriceDesc}</option>
            <option value="new">{t.sortNew}</option>
          </select>

          {/* Reset Filters */}
          {(selectedCategoryFilter !== 'all' || selectedBrand !== 'all' || inStockOnly || searchQuery) && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              title={t.filterReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.filterReset}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Products Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <Search className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              Товары не найдены
            </h3>
            <p className="text-xs text-zinc-500">{t.noProductsFound}</p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            {t.filterReset}
          </button>
        </div>
      )}
    </div>
  );
};
