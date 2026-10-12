import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowLeft, Users, ShieldAlert, CheckCircle, Star } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { users, updateUserStatus, toggleUserVip, language, t, setPage } = useApp();

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
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
            {t.manageCustomersTitle} ({users.length})
          </h1>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">{t.customerName}</th>
                <th className="py-3 px-4">{t.customerEmail}</th>
                <th className="py-3 px-4">{t.customerSpent}</th>
                <th className="py-3 px-4">{t.customerOrdersCount}</th>
                <th className="py-3 px-4">VIP Статус</th>
                <th className="py-3 px-4">{t.customerStatus}</th>
                <th className="py-3 px-4 text-right">{t.customerActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-950 dark:text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.isVip && (
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">{u.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-500">{u.email}</td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-950 dark:text-white">
                    {formatPrice(u.totalSpent)}
                  </td>
                  <td className="py-3 px-4 font-mono">{u.ordersCount}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleUserVip(u.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                        u.isVip
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {u.isVip ? 'VIP Членство' : 'Обычный'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        u.status === 'active' ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {u.status === 'active' ? t.statusActive : t.statusBlocked}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() =>
                        updateUserStatus(u.id, u.status === 'active' ? 'blocked' : 'active')
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        u.status === 'active'
                          ? 'text-rose-500 hover:bg-rose-500/10'
                          : 'text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                    >
                      {u.status === 'active' ? t.blockCustomer : t.unblockCustomer}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
