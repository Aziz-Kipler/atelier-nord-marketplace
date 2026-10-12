import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShoppingBag, ArrowRight, Trash2, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    language,
    t,
    setPage,
    currentUser,
  } = useApp();

  // Checkout inputs
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const [shippingAddress, setShippingAddress] = useState(
    currentUser.addresses[0] || 'Москва, Столешников переулок, 14, кв. 10'
  );
  const [recipientName, setRecipientName] = useState(currentUser.name);
  const [recipientPhone, setRecipientPhone] = useState(currentUser.phone);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NORD15') {
      const disc = Math.round(cartTotal * 0.15);
      setPromoDiscount(disc);
      setPromoMessage({ text: 'Промокод NORD15 применен (-15%)' });
    } else {
      setPromoMessage({ text: t.promoInvalid, error: true });
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const order = createOrder({
      shippingAddress,
      paymentMethod:
        paymentMethod === 'card'
          ? t.paymentCard
          : paymentMethod === 'sber'
          ? t.paymentSber
          : t.paymentCOD,
      discount: promoDiscount,
    });

    setCreatedOrderNumber(order.orderNumber);
  };

  // Order Success Screen
  if (createdOrderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">
            {t.orderSuccessTitle}
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            {t.orderSuccessSubtitle}
          </p>
          <div className="pt-2 text-xs font-mono text-zinc-400">
            {t.orderNumber}: <strong className="text-zinc-950 dark:text-white">{createdOrderNumber}</strong>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => setPage('profile')}
            className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {t.ordersHistory}
          </button>
          <button
            onClick={() => {
              setCreatedOrderNumber(null);
              setPage('catalog');
            }}
            className="px-6 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  // Empty Bag View
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
            {t.cartEmpty}
          </h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {t.cartEmptySubtitle}
          </p>
        </div>

        <button
          onClick={() => setPage('catalog')}
          className="px-6 py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
        >
          <span>{t.exploreCatalog}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const shippingCost = cartTotal >= 15000 ? 0 : 800;
  const finalTotal = Math.max(0, cartTotal - promoDiscount + shippingCost);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {t.cartTitle} ({cart.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          {t.clearCart}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Itemized Cart list (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => {
            const title = item.product.title[language] || item.product.title.ru;
            const img = item.product.images[0] || '';

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex gap-4 items-center"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  <img src={img} alt={title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                    {item.product.brand}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>
                      {t.size}: <strong className="text-zinc-700 dark:text-zinc-300">{item.selectedSize}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      {t.color}: <strong className="text-zinc-700 dark:text-zinc-300">{item.selectedColor.name}</strong>
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-white pt-1">
                    {formatPrice(item.product.price)}
                  </div>
                </div>

                {/* Stepper & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title={t.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-xs">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary & Checkout Form (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            {t.orderSummary}
          </h2>

          {/* Pricing breakdown */}
          <div className="space-y-2 text-xs border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex justify-between text-zinc-500">
              <span>{t.subtotal}</span>
              <span className="font-mono text-zinc-900 dark:text-white">
                {formatPrice(cartTotal)}
              </span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-500 font-semibold">
                <span>{t.discount} (-15%)</span>
                <span className="font-mono">-{formatPrice(promoDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-500">
              <span>{t.shipping}</span>
              <span className="font-mono text-zinc-900 dark:text-white">
                {shippingCost === 0 ? t.freeShipping : formatPrice(shippingCost)}
              </span>
            </div>

            <div className="pt-2 flex justify-between text-sm font-bold text-zinc-950 dark:text-white border-t border-zinc-200 dark:border-zinc-800">
              <span>{t.totalToPay}</span>
              <span className="font-mono text-base">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Promo code input */}
          <form onSubmit={handleApplyPromo} className="space-y-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={t.promoPlaceholder}
                className="flex-1 py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 uppercase font-mono"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold cursor-pointer"
              >
                {t.applyPromo}
              </button>
            </div>
            {promoMessage && (
              <p
                className={`text-[11px] font-medium ${
                  promoMessage.error ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                {promoMessage.text}
              </p>
            )}
          </form>

          {/* Checkout Express Form */}
          <form onSubmit={handleCheckout} className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-semibold text-zinc-950 dark:text-white uppercase tracking-wider">
              {t.deliveryAddress}
            </div>

            <div>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={t.deliveryAddressPlaceholder}
                className="w-full py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t.recipientName}
                className="w-full py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700"
              />
              <input
                type="text"
                required
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder={t.recipientPhone}
                className="w-full py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 font-mono"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-zinc-500 uppercase">
                {t.paymentMethod}
              </div>
              <div className="space-y-1 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span>{t.paymentCard}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'sber'}
                    onChange={() => setPaymentMethod('sber')}
                  />
                  <span>{t.paymentSber}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span>{t.paymentCOD}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              {t.confirmOrder}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
