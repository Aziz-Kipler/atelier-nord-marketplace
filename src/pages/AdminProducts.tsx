import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Plus, Trash2, Edit3, ArrowLeft, Image } from 'lucide-react';
import { Product } from '../types/index.ts';

export const AdminProducts: React.FC = () => {
  const { products, deleteProduct, language, t, setPage, openPublishModal } = useApp();

  const formatPrice = (val: number) => {
    return language === 'ru' ? `${val.toLocaleString()} ₽` : `$${Math.round(val / 95).toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 w-full max-w-full overflow-hidden">
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
            {t.manageProductsTitle} ({products.length})
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Управление ассортиментом маркетплейса, мульти-фотографиями, ценами и складскими остатками
          </p>
        </div>

        <button
          onClick={() => openPublishModal(null)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addProductButton}</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Модель и фото</th>
                <th className="py-3 px-4">Категория</th>
                <th className="py-3 px-4">Цена</th>
                <th className="py-3 px-4">Остаток</th>
                <th className="py-3 px-4">Размеры</th>
                <th className="py-3 px-4 text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-zinc-200 shrink-0 border border-zinc-200 dark:border-zinc-700">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {p.images.length > 1 && (
                          <span className="absolute bottom-0 right-0 bg-black/70 text-white font-mono text-[9px] px-1 rounded-tl">
                            {p.images.length} фото
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-zinc-900 dark:text-white truncate">
                          {p.title.ru}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {p.brand} · SKU: {p.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-mono text-zinc-500">
                    {p.category}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-950 dark:text-white">
                    {formatPrice(p.price)}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold">
                    <span className={p.stockQuantity < 10 ? 'text-amber-500 font-bold' : 'text-zinc-700 dark:text-zinc-300'}>
                      {p.stockQuantity} шт.
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                    {p.sizes.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openPublishModal(p)}
                        className="p-2 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition-colors cursor-pointer"
                        title={t.editProduct}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(t.confirmDelete)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title={t.deleteProduct}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
