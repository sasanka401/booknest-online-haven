import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCart } from './CartContext';

interface OrderItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
}

interface OrderData {
  orderNumber: string;
  orderDate: string;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  shippingMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
}

interface OrderContextType {
  currentOrder: OrderData | null;
  orderHistory: OrderData[];
  setCurrentOrder: (order: OrderData) => void;
  addToOrderHistory: (order: OrderData) => void;
  clearCurrentOrder: () => void;
  getOrderById: (orderId: string) => OrderData | undefined;
  removeOrder: (orderId: string) => void;
  clearOrderHistory: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderData[]>([]);

  const addToOrderHistory = (order: OrderData) => {
    setOrderHistory(prev => [order, ...prev]);
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const getOrderById = (orderId: string) => {
    return orderHistory.find(order => order.orderNumber === orderId);
  };

  const removeOrder = (orderId: string) => {
    setOrderHistory(prev => prev.filter(order => order.orderNumber !== orderId));
  };

  const clearOrderHistory = () => {
    setOrderHistory([]);
  };

  return (
    <OrderContext.Provider value={{ 
      currentOrder, 
      orderHistory,
      setCurrentOrder, 
      addToOrderHistory,
      clearCurrentOrder,
      getOrderById,
      removeOrder,
      clearOrderHistory
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 