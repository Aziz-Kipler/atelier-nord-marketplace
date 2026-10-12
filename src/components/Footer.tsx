import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setPage, setSelectedCategoryFilter } = useApp();

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 border-t border-zinc-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand & Manifesto */}
          <div className="space-y-3 md:col-span-1">
            <div className="text-lg font-bold tracking-tight text-white uppercase">
              {t.brandName}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {t.footerAboutText}
            </p>
            <div className="pt-2 text-[11px] font-mono text-zinc-500">
              STOLESHNIKOV LANE 14, MOSCOW
            </div>
          </div>

          {/* Column 2: Catalog links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-wider text-white uppercase">
              {t.footerCatalogTitle}
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('clothing');
                    setPage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navClothing}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('footwear');
                    setPage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navFootwear}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('headwear');
                    setPage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navHeadwear}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('accessories');
                    setPage('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navAccessories}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-wider text-white uppercase">
              {t.footerClientsTitle}
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => setPage('profile')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.footerDelivery}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('profile')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.footerReturns}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.footerCare}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('customer_dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navCustomerDashboard}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Concierge & Newsletter */}
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-wider text-white uppercase">
              {t.footerContactsTitle}
            </div>
            <div className="space-y-1 text-xs text-zinc-400">
              <div className="text-white font-medium">{t.footerPhone}</div>
              <div className="text-zinc-400">concierge@atelier-nord.com</div>
              <div className="text-[11px] text-zinc-500 pt-1">Пн–Вс: 10:00 — 22:00 (MSK)</div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Бутик открыт для примерки</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment markers */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 {t.brandName}. {t.footerRights}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
            <span>MIR</span>
            <span>·</span>
            <span>VISA</span>
            <span>·</span>
            <span>MASTERCARD</span>
            <span>·</span>
            <span>SBERPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
