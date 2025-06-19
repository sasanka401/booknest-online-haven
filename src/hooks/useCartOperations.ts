
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { CartItem } from '@/types/cart';

export const useCartOperations = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCartItems = useCallback(async () => {
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
  }, [user]);

  const addToCart = useCallback(async (book: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const existingCartItem = cartItems.find(item => item.id === book.id);

      if (existingCartItem) {
        await updateQuantity(book.id, existingCartItem.quantity + 1);
        toast.success(`Increased quantity of "${book.title}" in your cart`);
      } else {
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
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, [user, cartItems, fetchCartItems]);

  const removeFromCart = useCallback(async (bookId: string) => {
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

      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  }, [user, cartItems, fetchCartItems]);

  const updateQuantity = useCallback(async (bookId: string, quantity: number) => {
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
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  }, [user, removeFromCart, fetchCartItems]);

  const clearCart = useCallback(async () => {
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
  }, [user]);

  return {
    cartItems,
    loading,
    fetchCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
