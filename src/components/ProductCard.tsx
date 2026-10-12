import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { Bookmark, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t, navigateToProduct, wishlist, toggleWishlist, addToCart } = useApp();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const isSaved = wishlist.includes(product.id);
  const title = product.title[language] || product.title.ru;
  const currentImage = product.images[activeImgIndex] || product.images[0] || '';

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0] || 'M', product.colors[0] || { name: 'Standard', hex: '#18181b' });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigateToProduct(product.id)}
      className="group relative flex flex-col bg-white dark:bg-zinc-900/40 rounded-2xl p-2 sm:p-2.5 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* 1. Product Image Frame with Multi-Image Hover switch */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
        onMouseEnter={() => {
          if (product.images.length > 1) {
            setActiveImgIndex(1);
          }
        }}
        onMouseLeave={() => setActiveImgIndex(0)}
      >
        <img
          src={currentImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Photo count indicator if product has multiple photos */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90">
            {activeImgIndex + 1}/{product.images.length}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-rose-500 text-white shadow-md scale-105'
              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:text-rose-500'
          }`}
          title={isSaved ? 'Удалить из избранного' : 'В избранное'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Discount Badge (Ozon Style) */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold font-mono tracking-tight shadow-sm">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* 2. Product Metadata & Clean Price Hierarchy */}
      <div className="mt-2.5 flex flex-col flex-1 justify-between space-y-2 px-1">
        <div className="space-y-1">
          {/* Price Block (Large bold price, old price with line-through, no overlaps!) */}
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black font-mono tracking-tight text-zinc-950 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-zinc-400 line-through font-mono">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Brand Kicker */}
          <div className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-400 uppercase truncate">
            {product.brand}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
        </div>

        {/* Rating, Reviews count & Sizes */}
        <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">{product.rating}</span>
              <span className="text-zinc-400">({product.reviewsCount})</span>
            </div>

            <div className="text-zinc-400 text-[10px] font-mono">
              {product.sizes.length} {language === 'ru' ? 'разм.' : 'sizes'}
            </div>
          </div>

          {/* Quick Add to Cart button (Ozon-style vibrant, tactile button) */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-98'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>В корзине</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>В корзину</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
