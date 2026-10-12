import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Plus, Trash2, Image, Sparkles, Check, Upload } from 'lucide-react';
import { Category, Product } from '../types/index.ts';

interface PublishProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const PHOTO_PRESETS: { label: string; url: string }[] = [
  { label: 'Пальто / Куртка (Вид спереди)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Пальто / Куртка (На модели)', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80' },
  { label: 'Худи / Свитшот (Спереди)', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Худи (Оверсайз фит)', url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Кеды / Обувь (Профиль)', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
  { label: 'Кеды (Сверху / подошва)', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80' },
  { label: 'Челси / Ботинки', url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80' },
  { label: 'Шапка / Бини', url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Шляпа / Федора', url: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Кожаная сумка / Тоут', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
];

export const PublishProductModal: React.FC<PublishProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, t } = useApp();

  const [titleRu, setTitleRu] = useState(productToEdit?.title.ru || '');
  const [titleEn, setTitleEn] = useState(productToEdit?.title.en || '');
  const [brand, setBrand] = useState(productToEdit?.brand || '');
  const [category, setCategory] = useState<Category>(productToEdit?.category || 'clothing');
  const [price, setPrice] = useState(productToEdit?.price || 12500);
  const [oldPrice, setOldPrice] = useState(productToEdit?.oldPrice || 14900);
  const [stockQuantity, setStockQuantity] = useState(productToEdit?.stockQuantity || 15);
  const [sizesStr, setSizesStr] = useState(productToEdit?.sizes.join(', ') || 'S, M, L, XL');
  const [descriptionRu, setDescriptionRu] = useState(productToEdit?.description.ru || '');
  const [compositionRu, setCompositionRu] = useState(productToEdit?.composition.ru || '');

  // Multi-image list
  const [images, setImages] = useState<string[]>(
    productToEdit?.images || [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleAddPreset = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleRu.trim() || !brand.trim() || images.length === 0) return;

    const sizes = sizesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (productToEdit) {
      updateProduct({
        ...productToEdit,
        title: { ru: titleRu, en: titleEn || titleRu },
        brand,
        category,
        price,
        oldPrice: oldPrice > price ? oldPrice : undefined,
        stockQuantity,
        sizes: sizes.length > 0 ? sizes : ['ONE SIZE'],
        images,
        description: { ru: descriptionRu, en: descriptionRu },
        composition: { ru: compositionRu, en: compositionRu },
      });
    } else {
      addProduct({
        title: { ru: titleRu, en: titleEn || titleRu },
        brand,
        category,
        price,
        oldPrice: oldPrice > price ? oldPrice : undefined,
        stockQuantity,
        sizes: sizes.length > 0 ? sizes : ['ONE SIZE'],
        colors: [
          { name: 'Nero Black', hex: '#09090b' },
          { name: 'Pure White', hex: '#f8fafc' },
        ],
        inStock: stockQuantity > 0,
        images,
        description: {
          ru: descriptionRu || 'Селективная премиальная модель с безупречным кроем и качеством материалов.',
          en: titleEn || 'Selective garment crafted with luxury materials.',
        },
        composition: {
          ru: compositionRu || '100% органический хлопок или шерсть.',
          en: '100% Premium cotton or wool.',
        },
        rating: 5.0,
        reviewsCount: 1,
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Публикация товара на маркетплейсе</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              {productToEdit ? 'Редактировать товар' : 'Опубликовать новый товар'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
              Товар успешно опубликован!
            </h3>
            <p className="text-xs text-zinc-500">
              Ваш товар добавлен в общий каталог и готов к продаже.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* 1. MULTI-PHOTO GALLERY MANAGEMENT */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-zinc-950 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-blue-600" />
                  <span>Фотографии товара (минимум 1, рекомендуется 2–4 ракурса)</span>
                </label>
                <span className="font-mono text-zinc-500 text-[11px]">
                  Добавлено: {images.length} фото
                </span>
              </div>

              {/* Photo Previews Carousel / Grid */}
              <div className="flex flex-wrap gap-3">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-zinc-300 dark:border-zinc-600 group bg-zinc-200 dark:bg-zinc-800 shadow-sm shrink-0"
                  >
                    <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded font-mono">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      disabled={images.length <= 1}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-30"
                      title="Удалить фото"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Input for adding new photo link */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Вставьте ссылку на фото (URL) или выберите из быстрых шаблонов ниже..."
                  className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить фото</span>
                </button>
              </div>

              {/* Quick Preset Photos Picker (Ozon style ready-to-use professional photos) */}
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
                <div className="text-[10px] font-semibold text-zinc-500 uppercase mb-1.5">
                  Быстрые качественные фото для примера (нажмите, чтобы добавить ракурс):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PHOTO_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPreset(p.url)}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-700 dark:text-zinc-300 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      + {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. GENERAL INFO (Title, Brand, Category) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Название товара (на русском) *
                </label>
                <input
                  type="text"
                  required
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  placeholder="напр. Двубортный тренч оверсайз..."
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Название на английском (EN)
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Double-Breasted Oversized Trench..."
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Бренд / Мануфактура *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="напр. NORDIC TAILORS или ваш бренд"
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Категория товара *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 cursor-pointer font-medium"
                >
                  <option value="clothing">Одежда (Clothing: пальто, худи, брюки)</option>
                  <option value="footwear">Обувь (Footwear: кеды, ботинки, дерби)</option>
                  <option value="headwear">Головные уборы (Headwear: шапки, шляпы)</option>
                  <option value="accessories">Аксессуары (Accessories: сумки, шарфы)</option>
                </select>
              </div>
            </div>

            {/* 3. PRICES & INVENTORY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Текущая цена (₽) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Старая цена без скидки (₽)
                </label>
                <input
                  type="number"
                  min={0}
                  value={oldPrice}
                  onChange={(e) => setOldPrice(Number(e.target.value))}
                  placeholder="Для бейджа скидки (необяз.)"
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Количество на складе (шт) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono font-semibold"
                />
              </div>
            </div>

            {/* 4. SIZES & DETAILS */}
            <div>
              <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                Доступные размеры (через запятую) *
              </label>
              <input
                type="text"
                required
                value={sizesStr}
                onChange={(e) => setSizesStr(e.target.value)}
                placeholder="напр. 42, 44, 46, 48 или S, M, L, XL"
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Описание модели
                </label>
                <textarea
                  rows={2}
                  value={descriptionRu}
                  onChange={(e) => setDescriptionRu(e.target.value)}
                  placeholder="Особенности кроя, силуэт, посадка..."
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 uppercase text-[11px] mb-1">
                  Состав и уход
                </label>
                <textarea
                  rows={2}
                  value={compositionRu}
                  onChange={(e) => setCompositionRu(e.target.value)}
                  placeholder="напр. 100% шерсть, сухая чистка..."
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                />
              </div>
            </div>

            {/* Submit & Cancel */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer"
              >
                Отмена
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Опубликовать товар</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
