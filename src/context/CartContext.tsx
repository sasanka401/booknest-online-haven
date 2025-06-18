
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

// Cart item includes quantity
interface CartItem extends Book {
  quantity: number;
}

// Context type definition
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loading: boolean;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart items from database when user changes
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
        image_url: item.books.image_url,
        rating: item.books.rating,
        quantity: item.quantity
      })) || [];

      setCartItems(cartData);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book: Book) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('user_carts')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('book_id', parseInt(book.id))
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { error } = await supabase
          .from('user_carts')
          .update({ 
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('book_id', parseInt(book.id));

        if (error) throw error;
        toast.success(`Added another copy of "${book.title}" to your cart`);
      } else {
        // Insert new item
        const { error } = await supabase
          .from('user_carts')
          .insert({
            user_id: user.id,
            book_id: parseInt(book.id),
            quantity: 1
          });

        if (error) throw error;
        toast.success(`Added "${book.title}" to your cart`);
      }

      // Refresh cart items
      await fetchCartItems();
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

      // Refresh cart items
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    try {
      const { error } = await supabase
        .from('user_carts')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('book_id', parseInt(bookId));

      if (error) throw error;

      // Refresh cart items
      await fetchCartItems();
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
      toast.info("Cart cleared");
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
