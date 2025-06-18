
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

// Book type definition from the existing app
interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image_url: string;
  rating: number;
}

// Context type definition
interface WishlistContextType {
  wishlistItems: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  getWishlistCount: () => number;
  loading: boolean;
}

// Create the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch wishlist items from database when user changes
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
      // Check if item already exists in wishlist
      const { data: existingItem } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', parseInt(book.id))
        .single();

      if (existingItem) {
        toast.info(`"${book.title}" is already in your wishlist`);
        return;
      }

      // Insert new item
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          book_id: parseInt(book.id)
        });

      if (error) throw error;

      toast.success(`Added "${book.title}" to your wishlist`);
      
      // Refresh wishlist items
      await fetchWishlistItems();
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

      // Refresh wishlist items
      await fetchWishlistItems();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const isInWishlist = (bookId: string) => {
    return wishlistItems.some((item) => item.id === bookId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
