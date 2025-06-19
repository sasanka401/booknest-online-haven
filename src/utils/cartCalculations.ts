
import { CartItem } from '@/types/cart';

export const calculateTotalPrice = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const calculateTotalItems = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};
