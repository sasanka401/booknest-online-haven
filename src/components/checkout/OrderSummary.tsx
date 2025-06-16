import React from "react";
import { CardContent, Card } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface OrderSummaryProps {
  shippingMethod: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ shippingMethod }) => {
  const { cartItems, getTotalPrice } = useCart();

  // Calculate shipping cost based on method
  const getShippingCost = () => {
    switch (shippingMethod) {
      case "express":
        return 49;
      case "next-day":
        return 99;
      default:
        return 0;
    }
  };

  // Calculate total with shipping
  const subtotal = getTotalPrice();
  const shipping = getShippingCost();
  const total = subtotal + shipping;

  return (
    <Card className="lg:col-span-1 h-fit">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-1 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.title} × {item.quantity}</span>
              <span className="flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-3 mt-3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span className="flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
