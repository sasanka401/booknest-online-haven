import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image_url: string;
  rating: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_carts')
        .select(`
          quantity,
          books!inner(
            id,
            title,
            author,
            price,
            image_url,
            rating
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartData = data?.map(item => ({
        id: item.books.id.toString(),
        title: item.books.title,
        author: item.books.author,
        price: item.books.price,
        quantity: item.quantity,
        image_url: item.books.image_url,
        rating: item.books.rating
      })) || [];

      setCartItems(cartData);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      // Check if the book is already in the cart
      const existingCartItem = cartItems.find(item => item.id === book.id);

      if (existingCartItem) {
        // If it exists, update the quantity
        await updateQuantity(book.id, existingCartItem.quantity + 1);
        toast.success(`Increased quantity of "${book.title}" in your cart`);
      } else {
        // If it doesn't exist, add it to the cart with quantity 1
        const { error } = await supabase
          .from('user_carts')
          .insert({
            user_id: user.id,
            book_id: parseInt(book.id),
            quantity: 1
          });

        if (error) throw error;

        setCartItems(prevItems => [...prevItems, { ...book, quantity: 1 }]);
        toast.success(`Added "${book.title}" to your cart`);
        await fetchCartItems(); // Refresh the cart
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (bookId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', parseInt(bookId));

      if (error) throw error;

      const removedItem = cartItems.find(item => item.id === bookId);
      if (removedItem) {
        toast.info(`Removed "${removedItem.title}" from your cart`);
      }

      await fetchCartItems(); // Refresh the cart
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(bookId);
        return;
      }

      const { error } = await supabase
        .from('user_carts')
        .update({ quantity: quantity })
        .eq('user_id', user.id)
        .eq('book_id', parseInt(bookId));

      if (error) throw error;

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === bookId ? { ...item, quantity: quantity } : item
        )
      );
      await fetchCartItems(); // Refresh the cart
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
