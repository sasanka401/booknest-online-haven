
export interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image_url: string;
  rating: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loading: boolean;
}
