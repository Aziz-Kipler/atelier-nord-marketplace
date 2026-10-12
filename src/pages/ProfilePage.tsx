import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { User, MapPin, Package, Clock, ShieldCheck, Plus, Check } from 'lucide-react';
import { OrderStatus } from '../types/index.ts';

export const ProfilePage: React.FC = () => {
  const { currentUser, orders, language, t } = useApp();

  const [addresses, setAddresses] = useState<string[]>(currentUser.addresses);
  const [newAddress, setNewAddress] = useState('');
  const [showAddressInput, setShowAddressInput] = useState(false);

  const userOrders = orders.filter((o) => o.userId === currentUser.id);

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress.trim()]);
      setNewAddress('');
      setShowAddressInput(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="text-emerald-500 font-semibold">{t.statusDelivered}</span>;
      case 'shipped':
        return <span className="text-sky-500 font-semibold">{t.statusShipped}</span>;
      case 'processing':
        return <span className="text-amber-500 font-semibold">{t.statusProcessing}</span>;
      case 'cancelled':
        return <span className="text-rose-500 font-semibold">{t.statusCancelled}</span>;
      default:
        return <span className="text-zinc-400 font-semibold">{t.statusPending}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {t.profileTitle}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">{t.profileSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Client Credentials & Addresses (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* User Profile Card */}
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-zinc-950 dark:text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-xs text-zinc-500 truncate">{currentUser.email}</div>
                <div className="text-xs font-mono text-zinc-400">{currentUser.phone}</div>
              </div>
            </div>

            {/* Loyalty KPI */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-400 block">{t.totalSpent}</span>
                <span className="font-mono font-bold text-zinc-950 dark:text-white text-sm">
                  {formatPrice(currentUser.totalSpent)}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block">{t.personalDiscount}</span>
                <span className="font-mono font-bold text-amber-500 text-sm">15% VIP Tier</span>
              </div>
            </div>
          </div>

          {/* Saved Delivery Addresses */}
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                {t.savedAddresses}
              </h3>
              <button
                onClick={() => setShowAddressInput(!showAddressInput)}
                className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addAddress}</span>
              </button>
            </div>

            {showAddressInput && (
              <form onSubmit={handleAddAddress} className="space-y-2">
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Город, улица, дом, кв..."
                  className="w-full py-2 px-3 text-xs rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold cursor-pointer"
                >
                  Сохранить
                </button>
              </form>
            )}

            <div className="space-y-2">
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5"
                >
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{addr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Orders History (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
            {t.ordersHistory} ({userOrders.length})
          </h2>

          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4"
                >
                  {/* Order header row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-950 dark:text-white">
                        {ord.orderNumber}
                      </span>
                      <span className="text-zinc-400">·</span>
                      <span className="font-mono text-zinc-500">{ord.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(ord.status)}
                      <span className="text-zinc-400">·</span>
                      <span className="font-mono font-bold text-zinc-950 dark:text-white text-sm">
                        {formatPrice(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items preview */}
                  <div className="space-y-2">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.image}
                            alt=""
                            className="w-10 h-12 object-cover rounded bg-zinc-200"
                          />
                          <div>
                            <div className="font-semibold text-zinc-900 dark:text-white">
                              {it.productTitle[language] || it.productTitle.ru}
                            </div>
                            <div className="text-zinc-500 text-[11px]">
                              {it.brand} · Размер: {it.selectedSize} · Цвет: {it.selectedColor}
                            </div>
                          </div>
                        </div>

                        <div className="font-mono text-zinc-700 dark:text-zinc-300">
                          {it.quantity} x {formatPrice(it.price)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Tracking */}
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 gap-2">
                    <div>Доставка: {ord.shippingAddress}</div>
                    <div>Ориентировочная дата: {ord.estimatedDelivery}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8">
              <Package className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">{t.noOrdersYet}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
