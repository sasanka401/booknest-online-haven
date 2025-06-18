import { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

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
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    return items;
  };

  const addToCart = (book: Book) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      
      let newItems;
      if (existingItem) {
        // If item already exists, increase quantity
        newItems = prevItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast.success(`Added another copy of "${book.title}" to your cart`);
      } else {
        // If item doesn't exist, add it with quantity 1
        newItems = [...prevItems, { ...book, quantity: 1 }];
        toast.success(`Added "${book.title}" to your cart`);
      }
      
      return saveCart(newItems);
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== bookId);
      const removedItem = prevItems.find((item) => item.id === bookId);
      if (removedItem) {
        toast.info(`Removed "${removedItem.title}" from your cart`);
      }
      return saveCart(newItems);
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity } : item
      );
      return saveCart(newItems);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.info("Cart cleared");
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
