import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowLeft, ClipboardList, Check, Trash2, Star, MessageSquare } from 'lucide-react';
import { OrderStatus } from '../types/index.ts';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, reviews, language, t, setPage } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 w-full max-w-full overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <button
            onClick={() => setPage('admin_dashboard')}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться в аналитику</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {t.manageOrdersTitle} ({orders.length})
          </h1>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">№ Заказа</th>
                <th className="py-3 px-4">{t.orderCustomer}</th>
                <th className="py-3 px-4">{t.orderDate}</th>
                <th className="py-3 px-4">{t.orderItemsCount}</th>
                <th className="py-3 px-4">{t.orderTotal}</th>
                <th className="py-3 px-4">{t.orderStatusLabel}</th>
                <th className="py-3 px-4 text-right">Детали</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-950 dark:text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900 dark:text-white">{ord.userName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{ord.userPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-500">{ord.createdAt}</td>
                  <td className="py-3 px-4 font-mono">{ord.items.length}</td>
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
                    <button
                      onClick={() =>
                        setSelectedOrder(selectedOrder === ord.id ? null : ord.id)
                      }
                      className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline cursor-pointer"
                    >
                      {selectedOrder === ord.id ? 'Скрыть' : 'Показать'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Order Detailed Expandable View */}
      {selectedOrder && (
        <div className="p-6 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-4">
          {(() => {
            const ord = orders.find((o) => o.id === selectedOrder);
            if (!ord) return null;

            return (
              <>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Содержимое заказа: {ord.orderNumber}
                  </h3>
                  <div className="text-xs text-zinc-400 font-mono">
                    Оплата: {ord.paymentMethod}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <div>
                        <span className="font-semibold text-white">
                          {it.productTitle[language] || it.productTitle.ru}
                        </span>
                        <span className="text-zinc-400 ml-2">
                          (Размер: {it.selectedSize}, Цвет: {it.selectedColor})
                        </span>
                      </div>
                      <span className="font-mono text-zinc-300">
                        {it.quantity} шт × {formatPrice(it.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400">
                  Адрес доставки: <strong className="text-white">{ord.shippingAddress}</strong>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Customer Feedback & Reviews Moderation Queue */}
      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
            Фидбек и модерация отзывов клиентов ({reviews.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-950 dark:text-white">{rev.userName}</span>
                <span className="font-mono text-zinc-400">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(rev.rating)}
                <span className="text-emerald-500 font-semibold ml-2">Опубликован</span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                «{rev.comment}»
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
