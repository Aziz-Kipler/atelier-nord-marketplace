import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { OrderStatus } from '../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const { t, orders, products, users, language, setPage, updateOrderStatus } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const averageCheck = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const activeCustomersCount = users.filter((u) => u.status === 'active').length;

  const lowStockProducts = products.filter((p) => p.stockQuantity < 10);

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 w-full max-w-full overflow-hidden">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-500 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>{t.adminPanel} · RBAC EXECUTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {t.adminTitle}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">{t.adminSubtitle}</p>
        </div>

        {/* Quick Admin Navigation buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPage('admin_products')}
            className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {t.navAdminProducts}
          </button>
          <button
            onClick={() => setPage('admin_customers')}
            className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {t.navAdminCustomers}
          </button>
          <button
            onClick={() => setPage('admin_orders')}
            className="px-4 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            {t.navAdminOrders}
          </button>
        </div>
      </div>

      {/* 2. Platform KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Revenue */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.statRevenue}</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-950 dark:text-white">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold">+18.4% к прошлому месяцу</div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.statOrders}</span>
            <Package className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-950 dark:text-white">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-zinc-500">Обработано в системе</div>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.statAOV}</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-950 dark:text-white">
            {formatPrice(averageCheck)}
          </div>
          <div className="text-[11px] text-zinc-500">Средний чек покупателя</div>
        </div>

        {/* Active Customers */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">{t.statCustomers}</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-zinc-950 dark:text-white">
            {activeCustomersCount}
          </div>
          <div className="text-[11px] text-zinc-500">Зарегистрированных клиентов</div>
        </div>
      </div>

      {/* 3. Category Sales Distribution & Inventory Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Share Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
              {t.categoryShare}
            </h2>
            <span className="text-xs font-mono text-zinc-400">Q4 2026</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-zinc-700 dark:text-zinc-300">Одежда (Пальто, худи, брюки)</span>
                <span className="font-mono text-zinc-950 dark:text-white font-bold">52% (982 000 ₽)</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-950 dark:bg-white rounded-full" style={{ width: '52%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-zinc-700 dark:text-zinc-300">Обувь (Кеды Court, челси)</span>
                <span className="font-mono text-zinc-950 dark:text-white font-bold">28% (528 000 ₽)</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-700 dark:bg-zinc-400 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-zinc-700 dark:text-zinc-300">Головные уборы (Бини, федоры)</span>
                <span className="font-mono text-zinc-950 dark:text-white font-bold">12% (226 000 ₽)</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-zinc-700 dark:text-zinc-300">Аксессуары (Сумки, шарфы)</span>
                <span className="font-mono text-zinc-950 dark:text-white font-bold">8% (151 000 ₽)</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Inventory Warnings (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Остатки на складе</span>
            </h2>
            <button
              onClick={() => setPage('admin_products')}
              className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
            >
              Склад →
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-white">
                    {p.title.ru}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    SKU: {p.sku} · {p.brand}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold">
                    {p.stockQuantity} шт
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Queue with Instant Status Changer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
            {t.recentOrdersQueue} ({orders.length})
          </h2>
          <button
            onClick={() => setPage('admin_orders')}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          >
            Все заказы →
          </button>
        </div>

        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Заказ</th>
                  <th className="py-3 px-4">Покупатель</th>
                  <th className="py-3 px-4">Дата</th>
                  <th className="py-3 px-4">Сумма</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4 text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950 dark:text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div>{ord.userName}</div>
                      <div className="text-[11px] text-zinc-400">{ord.userEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500">{ord.createdAt}</td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950 dark:text-white">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 cursor-pointer"
                      >
                        <option value="pending">Оформлен</option>
                        <option value="processing">В обработке</option>
                        <option value="shipped">В пути</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-zinc-400">
                        {ord.items.length} поз.
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
