
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useCartOperations } from '@/hooks/useCartOperations';
import { calculateTotalPrice, calculateTotalItems } from '@/utils/cartCalculations';
import { CartContextType } from '@/types/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const cartOperations = useCartOperations();

  useEffect(() => {
    if (user) {
      cartOperations.fetchCartItems();
    }
  }, [user, cartOperations.fetchCartItems]);

  const getTotalPrice = () => calculateTotalPrice(cartOperations.cartItems);
  const getTotalItems = () => calculateTotalItems(cartOperations.cartItems);

  return (
    <CartContext.Provider value={{
      cartItems: cartOperations.cartItems,
      addToCart: cartOperations.addToCart,
      removeFromCart: cartOperations.removeFromCart,
      updateQuantity: cartOperations.updateQuantity,
      clearCart: cartOperations.clearCart,
      getTotalPrice,
      getTotalItems,
      loading: cartOperations.loading
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

export * from '@/types/cart';
