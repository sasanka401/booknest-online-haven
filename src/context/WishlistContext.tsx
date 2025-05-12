
import { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

// Book type definition from the existing app
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  rating: number;
}

// Context type definition
interface WishlistContextType {
  wishlistItems: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: number) => void;
  isInWishlist: (bookId: number) => boolean;
  getWishlistCount: () => number;
}

// Create the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Book[]>(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save to localStorage whenever wishlist changes
  const saveWishlist = (items: Book[]) => {
    localStorage.setItem("wishlist", JSON.stringify(items));
    return items;
  };

  const addToWishlist = (book: Book) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      
      if (existingItem) {
        // If item already exists, do nothing
        toast.info(`"${book.title}" is already in your wishlist`);
        return prevItems;
      } else {
        // If item doesn't exist, add it
        toast.success(`Added "${book.title}" to your wishlist`);
        return saveWishlist([...prevItems, book]);
      }
    });
  };

  const removeFromWishlist = (bookId: number) => {
    setWishlistItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== bookId);
      const removedItem = prevItems.find((item) => item.id === bookId);
      if (removedItem) {
        toast.info(`Removed "${removedItem.title}" from your wishlist`);
      }
      return saveWishlist(newItems);
    });
  };

  const isInWishlist = (bookId: number) => {
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
