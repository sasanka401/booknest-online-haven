
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import { ShippingFormValues, PaymentFormValues } from "@/components/checkout/validation-schemas";
import { useOrder } from '@/context/OrderContext';
import { supabase } from "@/lib/supabase";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [checkoutStep, setCheckoutStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);
  const { setCurrentOrder, addToOrderHistory } = useOrder();
  
  // Check if cart is empty and redirect to cart page if it is
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleShippingSubmit = (values: ShippingFormValues) => {
    setShippingData(values);
    setCheckoutStep("payment");
    toast.success("Shipping information saved");
  };

  const handleBackToShipping = () => {
    setCheckoutStep("shipping");
  };

  const handlePaymentSubmit = async (values: PaymentFormValues) => {
    if (!user || !shippingData) return;

    console.log("Payment form submitted with values:", values);
    console.log("Shipping data:", shippingData);
    
    // Customize payment processing message based on the payment method
    const paymentMethodMessages = {
      "credit-card": "Processing credit card payment...",
      "debit-card": "Processing debit card payment...",
      "upi": "Waiting for UPI confirmation...",
      "net-banking": "Redirecting to bank portal...",
      "cash-on-delivery": "Confirming cash on delivery option..."
    };
    
    const paymentMethod = values.paymentMethod || "credit-card";
    toast.info(paymentMethodMessages[paymentMethod as keyof typeof paymentMethodMessages] || "Processing payment...");
    
    try {
      // Generate order number
      const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
      
      // Calculate totals
      const subtotal = getTotalPrice();
      const shipping = getShippingCost();
      const total = subtotal + shipping;

      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          status: 'Processing',
          shipping_address: {
            fullName: shippingData.fullName,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            pinCode: shippingData.pinCode,
            phone: shippingData.phoneNumber,
            email: shippingData.email
          },
          payment_method: values.paymentMethod || "credit-card",
          shipping_method: shippingMethod,
          subtotal: subtotal,
          shipping: shipping,
          total: total
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        book_id: parseInt(item.id),
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create order data for context
      const orderContextData = {
        orderNumber: orderNumber,
        orderDate: new Date().toLocaleDateString(),
        status: "Processing",
        items: cartItems.map(item => ({
          id: parseInt(item.id),
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image_url
        })),
        shippingAddress: {
          fullName: shippingData.fullName,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          pinCode: shippingData.pinCode,
          phone: shippingData.phoneNumber,
          email: shippingData.email
        },
        paymentMethod: values.paymentMethod || "credit-card",
        shippingMethod: shippingMethod,
        subtotal: subtotal,
        shipping: shipping,
        total: total
      };

      // Save order data in context
      setCurrentOrder(orderContextData);
      addToOrderHistory(orderContextData);
      
      toast.success("Payment successful! Your order has been placed.");
      await clearCart();
      navigate("/order-confirmation");

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

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
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto py-10 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Progress indicator */}
        <CheckoutProgress currentStep={checkoutStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <OrderSummary shippingMethod={shippingMethod} />
          
          {/* Checkout Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Step */}
            {checkoutStep === "shipping" && (
              <ShippingForm 
                onSubmit={handleShippingSubmit}
                shippingMethod={shippingMethod}
                onShippingMethodChange={setShippingMethod}
                defaultValues={shippingData || undefined}
              />
            )}

            {/* Payment Step */}
            {checkoutStep === "payment" && shippingData && (
              <PaymentForm 
                onSubmit={handlePaymentSubmit}
                onBack={handleBackToShipping}
                shippingData={shippingData}
                total={total}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
