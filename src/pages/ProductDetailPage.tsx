import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ArrowLeft,
  Bookmark,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Info,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    language,
    t,
    setPage,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || { name: 'Graphite', hex: '#27272a' });
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">{t.productNotFound}</h2>
        <button
          onClick={() => setPage('catalog')}
          className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
        >
          {t.backToCatalog}
        </button>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const title = product.title[language] || product.title.ru;
  const description = product.description[language] || product.description.ru;
  const composition = product.composition[language] || product.composition.ru;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2400);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(product.id, reviewRating, reviewComment, reviewAuthor || 'Покупатель');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-12 w-full max-w-full overflow-hidden">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          onClick={() => setPage('catalog')}
          className="flex items-center gap-2 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToCatalog}</span>
        </button>

        <div className="font-mono text-[11px] text-zinc-400">
          SKU: {product.sku}
        </div>
      </div>

      {/* Main Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Multi-Angle Image Gallery (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
            {product.images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-mono text-white/95">
                {selectedImageIndex + 1} из {product.images.length} фото
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-zinc-950 dark:border-white ring-1 ring-zinc-950 dark:ring-white'
                      : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Contiguous Purchase Module (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              {product.brand}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
              {title}
            </h1>

            {/* Rating and review counter */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <div className="flex items-center gap-1 font-semibold text-zinc-900 dark:text-white">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-500">{product.reviewsCount} отзывов покупателей</span>
              <span className="text-zinc-400">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">В наличии на складе</span>
            </div>

            {/* Price with tabular numerals and discount */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-zinc-950 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-base text-zinc-400 line-through font-mono">
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md font-mono">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {t.selectColor}: <span className="font-normal text-zinc-500">{selectedColor.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative ${
                    selectedColor.name === c.name
                      ? 'border-zinc-950 dark:border-white scale-110'
                      : 'border-zinc-300 dark:border-zinc-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {t.selectSize}
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">
                {product.stockQuantity} {t.inStockCount.toLowerCase()}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                    selectedSize === s
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Buy CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-zinc-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                    <span>{t.addedToCart}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </>
                )}
              </button>

              {/* Wishlist Bookmark Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200'
                }`}
                title="В избранное"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details & Specifications */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">
                {t.productDescription}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">
                {t.productComposition}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {composition}
              </p>
            </div>

            <div className="pt-2 space-y-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span>Бесплатная курьерская доставка от 15 000 ₽ с примеркой</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
                <span>Оригинальная продукция с серийным сертификатом</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
              {t.customerReviews} ({productReviews.length})
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono font-bold text-zinc-900 dark:text-white">
                {product.rating}
              </span>
              <span>/ 5.0 средний рейтинг</span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-3.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {showReviewForm ? t.cancel : t.writeReview}
          </button>
        </div>

        {/* Review Form Drawer/Accordion */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="p-5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-4 max-w-xl"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase mb-1">
                  {t.reviewAuthor}
                </label>
                <input
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="Иван К."
                  className="w-full py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase mb-1">
                  {t.reviewRating}
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700"
                >
                  <option value={5}>★★★★★ (5/5)</option>
                  <option value={4}>★★★★☆ (4/5)</option>
                  <option value={3}>★★★☆☆ (3/5)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase mb-1">
                {t.reviewComment}
              </label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Поделитесь впечатлениями о посадке, ткани и качестве..."
                className="w-full py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold cursor-pointer"
            >
              {t.sendReview}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productReviews.length > 0 ? (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {rev.userName}
                  </span>
                  <span className="font-mono text-zinc-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                  <span className="text-zinc-400 font-mono text-[10px] ml-1">Verified Purchase</span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500">{t.noReviewsYet}</p>
          )}
        </div>
      </section>
    </div>
  );
};
