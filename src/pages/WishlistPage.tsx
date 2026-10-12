import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Bookmark, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, t, setPage } = useApp();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {t.wishlistTitle} ({savedProducts.length})
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Сохраненные силуэты для примерки и последующего заказа
          </p>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
            <Bookmark className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
              {t.wishlistEmpty}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {t.wishlistEmptySubtitle}
            </p>
          </div>

          <button
            onClick={() => setPage('catalog')}
            className="px-6 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t.exploreCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
