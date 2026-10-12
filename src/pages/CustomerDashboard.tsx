import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import {
  Package,
  TrendingUp,
  Percent,
  Bookmark,
  Truck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, orders, wishlist, products, language, t, setPage } = useApp();

  const userOrders = orders.filter((o) => o.userId === currentUser.id);
  const activeOrder = userOrders.find((o) => o.status === 'shipped' || o.status === 'processing');

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 w-full max-w-full overflow-hidden">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
            Client Concierge & Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">
            Добро пожаловать, {currentUser.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Персональный статус лояльности: <strong className="text-amber-500">Atelier Black Member</strong>
          </p>
        </div>

        <button
          onClick={() => setPage('catalog')}
          className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
        >
          <span>{t.exploreCatalog}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Key Metrics Strip (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.totalSpent}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-950 dark:text-white">
            {formatPrice(currentUser.totalSpent)}
          </div>
          <div className="text-[11px] text-zinc-500">Суммарный объем заказов</div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.activeOrders}</span>
            <Package className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-950 dark:text-white">
            {userOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length}
          </div>
          <div className="text-[11px] text-zinc-500">Посылок на сборке или в пути</div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.personalDiscount}</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-amber-500">
            15% VIP
          </div>
          <div className="text-[11px] text-zinc-500">Автоскидка на все силуэты</div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.navWishlist}</span>
            <Bookmark className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-950 dark:text-white">
            {wishlist.length}
          </div>
          <div className="text-[11px] text-zinc-500">Сохраненных позиций</div>
        </div>
      </div>

      {/* 3. Live Active Delivery Tracker */}
      {activeOrder && (
        <div className="p-6 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Текущая доставка: {activeOrder.orderNumber}
                </h3>
                <div className="text-xs text-zinc-400">
                  Адрес: {activeOrder.shippingAddress}
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-amber-400">
              Ожидается: {activeOrder.estimatedDelivery}
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center mx-auto text-xs">
                ✓
              </div>
              <div className="font-semibold text-white">Оформлен</div>
              <div className="text-[10px] text-zinc-400">{activeOrder.createdAt}</div>
            </div>

            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center mx-auto text-xs">
                ✓
              </div>
              <div className="font-semibold text-white">Собран на складе</div>
              <div className="text-[10px] text-zinc-400">Проверен ОТК</div>
            </div>

            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center mx-auto text-xs animate-pulse">
                •
              </div>
              <div className="font-semibold text-sky-400">В пути с курьером</div>
              <div className="text-[10px] text-zinc-400">С примеркой 15 мин</div>
            </div>

            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto text-xs">
                4
              </div>
              <div className="text-zinc-500">Доставка</div>
              <div className="text-[10px] text-zinc-500">{activeOrder.estimatedDelivery}</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Curated Recommendations for the Customer */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
            Рекомендации для вашего гардероба
          </h2>
          <button
            onClick={() => setPage('catalog')}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          >
            Смотреть все →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
