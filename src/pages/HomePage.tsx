import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Category } from '../types/index.ts';
import { ArrowRight, ShieldCheck, Sparkles, RefreshCw, Truck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, products, setPage, setSelectedCategoryFilter } = useApp();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategoryFilter(cat);
    setPage('catalog');
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16 w-full max-w-full overflow-x-hidden">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative w-full bg-zinc-950 text-white overflow-hidden py-16 md:py-24 px-4 sm:px-6">
        {/* Soft architectural gradient illumination */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase">
              <span>{t.heroKicker}</span>
              <span aria-hidden="true">·</span>
              <span>NOIR ARCHIVE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              {t.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
              {t.heroDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setPage('catalog');
                }}
                className="px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-md cursor-pointer"
              >
                <span>{t.exploreCatalog}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategoryFilter('clothing');
                  setPage('catalog');
                }}
                className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>{t.viewLookbook}</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
                alt="Cashmere Overcoat"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

              {/* High-fashion hero card info */}
              <div className="relative z-10 h-full flex flex-col justify-between p-7 text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase bg-black/50 px-2 py-0.5 rounded backdrop-blur-md">
                    ATELIER EXCLUSIVE
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-black/50 px-2 py-0.5 rounded backdrop-blur-md">
                    LIMITED DROP
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                    CASHMERE OVERCOAT
                  </div>
                  <div className="text-2xl font-bold tracking-tight">Double-Breasted Wool 540g</div>
                  <div className="text-sm font-mono text-zinc-200 font-bold">68 500 ₽ / $720</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TILES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono tracking-wider uppercase text-zinc-500 mb-1">
              Architecture of Wardrobe
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {t.allCategories}
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setPage('catalog');
            }}
            className="text-xs font-semibold text-zinc-900 dark:text-white hover:opacity-75 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <span>{t.exploreCatalog}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Clothing */}
          <div
            onClick={() => handleCategoryClick('clothing')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-end cursor-pointer transition-all hover:shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
              alt="Clothing"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <div className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
                Section 01
              </div>
              <h3 className="text-lg font-bold tracking-tight mt-0.5">{t.navClothing}</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Пальто, худи, брюки
              </p>
            </div>
          </div>

          {/* Footwear */}
          <div
            onClick={() => handleCategoryClick('footwear')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-end cursor-pointer transition-all hover:shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
              alt="Footwear"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <div className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
                Section 02
              </div>
              <h3 className="text-lg font-bold tracking-tight mt-0.5">{t.navFootwear}</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Кеды, челси, дерби
              </p>
            </div>
          </div>

          {/* Headwear */}
          <div
            onClick={() => handleCategoryClick('headwear')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-end cursor-pointer transition-all hover:shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80"
              alt="Headwear"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <div className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
                Section 03
              </div>
              <h3 className="text-lg font-bold tracking-tight mt-0.5">{t.navHeadwear}</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Шапки-бини, федоры
              </p>
            </div>
          </div>

          {/* Accessories */}
          <div
            onClick={() => handleCategoryClick('accessories')}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-end cursor-pointer transition-all hover:shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
              alt="Accessories"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <div className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
                Section 04
              </div>
              <h3 className="text-lg font-bold tracking-tight mt-0.5">{t.navAccessories}</h3>
              <p className="text-xs text-zinc-300 mt-1">
                Кожаные сумки, шарфы
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED SELECTION / FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono tracking-wider uppercase text-zinc-500 mb-1">
              Curated Arrivals
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {t.curatedSelection}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              {t.curatedSubtitle}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setPage('catalog');
            }}
            className="hidden sm:flex text-xs font-semibold text-zinc-900 dark:text-white hover:opacity-75 transition-opacity items-center gap-1 cursor-pointer"
          >
            <span>{t.exploreCatalog}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. VALUE PROPOSITION & CRAFTSMANSHIP MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono tracking-widest uppercase text-zinc-500">
                Craftsmanship
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {t.craftsmanshipTitle}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.craftsmanshipText}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Truck className="w-5 h-5 text-zinc-950 dark:text-white" />
                <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  Доставка с примеркой
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Курьер дождется примерки 15 минут. Вы оплачиваете только подошедшие позиции.
                </p>
              </div>

              <div className="space-y-2">
                <ShieldCheck className="w-5 h-5 text-zinc-950 dark:text-white" />
                <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  100% Аутентичность
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Прямые контракты с европейскими брендами и мануфактурами без посредников.
                </p>
              </div>

              <div className="space-y-2">
                <RefreshCw className="w-5 h-5 text-zinc-950 dark:text-white" />
                <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  14 Дней на возврат
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Простой возврат без лишних бланков и мгновенный возврат средств на карту.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
