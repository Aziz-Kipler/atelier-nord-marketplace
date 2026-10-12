import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  Language,
  Theme,
  Page,
  Product,
  CartItem,
  Order,
  User,
  Review,
  Category,
} from '../types/index.ts';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
} from '../data/mockData.ts';
import { getTranslation } from '../i18n/translations.ts';

interface AppContextType {
  // Localization & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: ReturnType<typeof getTranslation>;

  // Routing & Navigation
  page: Page;
  setPage: (p: Page) => void;
  selectedProductId: string | null;
  navigateToProduct: (productId: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
  productToEdit: Product | null;
  openPublishModal: (product?: Product | null) => void;

  // Search & Global Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: Category | 'all';
  setSelectedCategoryFilter: (cat: Category | 'all') => void;

  // RBAC & Auth
  role: Role;
  setRole: (role: Role) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;

  // Catalog State
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'sku' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: { name: string; hex: string }, qty?: number) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Wishlist State
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders State
  orders: Order[];
  createOrder: (orderData: {
    shippingAddress: string;
    paymentMethod: string;
    discount?: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Customers (Admin & Registration)
  users: User[];
  registerUser: (userData: { name: string; email: string; phone: string }) => User;
  updateUserStatus: (userId: string, status: 'active' | 'blocked') => void;
  toggleUserVip: (userId: string) => void;

  // Reviews State
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string, authorName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state with localStorage fallback
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('atelier_theme') as Theme) || 'dark';
  });

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('atelier_lang') as Language) || 'ru';
  });

  // Role state
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('atelier_role') as Role) || 'buyer';
  });

  // Current page
  const [page, setPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const openPublishModal = (prod: Product | null = null) => {
    setProductToEdit(prod);
    setIsPublishModalOpen(true);
  };

  // Search & Category
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<Category | 'all'>('all');

  // Data collections with persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('atelier_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find((u) => u.role === role) || users[0];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('atelier_wishlist');
    return saved ? JSON.parse(saved) : ['prod_1', 'prod_5'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atelier_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('atelier_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Sync HTML root class for Dark / Light theme
  useEffect(() => {
    localStorage.setItem('atelier_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('atelier_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('atelier_role', role);
    // Auto switch mock user to match role
    const matched = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matched);
  }, [role, users]);

  useEffect(() => {
    localStorage.setItem('atelier_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('atelier_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setPage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product actions
  const addProduct = (prodData: Omit<Product, 'id' | 'sku' | 'createdAt'>) => {
    const newId = `prod_${Date.now()}`;
    const newSku = `AN-${prodData.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      sku: newSku,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewsCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Cart actions
  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: { name: string; hex: string },
    qty: number = 1
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.name === selectedColor.name
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      const newItem: CartItem = {
        id: `${product.id}_${selectedSize}_${selectedColor.name}_${Date.now()}`,
        productId: product.id,
        product,
        selectedSize,
        selectedColor,
        quantity: qty,
      };
      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Order actions
  const createOrder = ({
    shippingAddress,
    paymentMethod,
    discount = 0,
  }: {
    shippingAddress: string;
    paymentMethod: string;
    discount?: number;
  }): Order => {
    const finalTotal = Math.max(0, cartTotal - discount);
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      items: cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        brand: item.product.brand,
        price: item.product.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor.name,
        quantity: item.quantity,
        image: item.product.images[0] || '',
      })),
      total: finalTotal,
      discount,
      status: 'processing',
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update user stats
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              totalSpent: u.totalSpent + finalTotal,
              ordersCount: u.ordersCount + 1,
            }
          : u
      )
    );

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Customers actions
  const registerUser = (userData: { name: string; email: string; phone: string }): User => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'buyer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      addresses: ['Москва, Новый адрес доставки'],
      totalSpent: 0,
      ordersCount: 0,
      status: 'active',
      isVip: false,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setRole('buyer');
    return newUser;
  };

  const updateUserStatus = (userId: string, status: 'active' | 'blocked') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  };

  const toggleUserVip = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVip: !u.isVip } : u))
    );
  };

  // Review actions
  const addReview = (productId: string, rating: number, comment: string, authorName: string) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      productId,
      userId: currentUser.id,
      userName: authorName || currentUser.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      approved: true,
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const t = getTranslation(language);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
        page,
        setPage,
        selectedProductId,
        navigateToProduct,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isPublishModalOpen,
        setIsPublishModalOpen,
        productToEdit,
        openPublishModal,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        role,
        setRole,
        currentUser,
        setCurrentUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        users,
        registerUser,
        updateUserStatus,
        toggleUserVip,
        reviews,
        addReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
