export type Role = 'buyer' | 'admin';

export type Language = 'ru' | 'en';

export type Theme = 'dark' | 'light';

export type Category = 'clothing' | 'footwear' | 'headwear' | 'accessories';

export type Page =
  | 'home'
  | 'catalog'
  | 'product_detail'
  | 'cart'
  | 'wishlist'
  | 'profile'
  | 'customer_dashboard'
  | 'login'
  | 'admin_dashboard'
  | 'admin_products'
  | 'admin_customers'
  | 'admin_orders';

export interface LocalizedString {
  ru: string;
  en: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  sku: string;
  title: LocalizedString;
  brand: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
  stockQuantity: number;
  description: LocalizedString;
  composition: LocalizedString;
  isFeatured?: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productTitle: LocalizedString;
  brand: string;
  price: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  total: number;
  discount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  addresses: string[];
  totalSpent: number;
  ordersCount: number;
  status: 'active' | 'blocked';
  isVip: boolean;
  registeredAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  approved: boolean;
}
