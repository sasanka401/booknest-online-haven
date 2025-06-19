import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image_url: string;
  rating: number;
}

interface WishlistContextType {
  wishlistItems: Book[];
  addToWishlist: (book: Book) => Promise<void>;
  removeFromWishlist: (bookId: string) => Promise<void>;
  isInWishlist: (bookId: string) => boolean;
  getWishlistCount: () => number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
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

      const wishlistData = data?.map(item => ({
        id: item.books.id.toString(),
        title: item.books.title,
        author: item.books.author,
        price: item.books.price,
        image_url: item.books.image_url,
        rating: item.books.rating
      })) || [];

      setWishlistItems(wishlistData);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (book: Book) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          book_id: parseInt(book.id)
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info(`"${book.title}" is already in your wishlist`);
          return;
        }
        throw error;
      }

      toast.success(`Added "${book.title}" to your wishlist`);
      await fetchWishlistItems(); // Refresh the wishlist
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (bookId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', parseInt(bookId));

      if (error) throw error;

      const removedItem = wishlistItems.find(item => item.id === bookId);
      if (removedItem) {
        toast.info(`Removed "${removedItem.title}" from your wishlist`);
      }

      await fetchWishlistItems(); // Refresh the wishlist
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const isInWishlist = (bookId: string) => {
    return wishlistItems.some(item => item.id === bookId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
