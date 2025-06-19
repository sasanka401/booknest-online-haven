
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
    console.log("Shipping form submitted:", values);
    setShippingData(values);
    setCheckoutStep("payment");
    toast.success("Shipping information saved");
  };

  const handleBackToShipping = () => {
    setCheckoutStep("shipping");
  };

  const handlePaymentSubmit = async (values: PaymentFormValues) => {
    console.log("Payment submission started");
    console.log("Payment form values:", values);
    console.log("User:", user);
    console.log("Shipping data:", shippingData);
    console.log("Cart items:", cartItems);

    if (!user) {
      toast.error('Please login to complete your order');
      navigate('/auth');
      return;
    }

    if (!shippingData) {
      toast.error('Please complete shipping information first');
      setCheckoutStep("shipping");
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Validate payment method specific fields
    const paymentMethod = values.paymentMethod || "credit-card";
    console.log("Selected payment method:", paymentMethod);

    if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
      if (!values.cardName?.trim() || !values.cardNumber?.trim() || !values.expiryDate?.trim() || !values.cvv?.trim()) {
        toast.error("Please fill in all card details");
        return;
      }
    }

    // Show processing message
    const paymentMethodMessages = {
      "credit-card": "Processing credit card payment...",
      "debit-card": "Processing debit card payment...",
      "upi": "Processing UPI payment...",
      "net-banking": "Processing net banking payment...",
      "cash-on-delivery": "Confirming cash on delivery..."
    };
    
    toast.info(paymentMethodMessages[paymentMethod as keyof typeof paymentMethodMessages] || "Processing payment...");
    
    try {
      // Generate order number
      const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      console.log("Generated order number:", orderNumber);
      
      // Calculate totals
      const subtotal = getTotalPrice();
      const shipping = getShippingCost();
      const total = subtotal + shipping;

      console.log("Order totals:", { subtotal, shipping, total });

      // Create order in database
      const orderData = {
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
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        subtotal: subtotal,
        shipping: shipping,
        total: total
      };

      console.log("Creating order with data:", orderData);

      const { data: insertedOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      console.log("Order created successfully:", insertedOrder);

      // Create order items
      const orderItems = cartItems.map(item => {
        console.log("Processing cart item:", item);
        return {
          order_id: insertedOrder.id,
          book_id: parseInt(item.id),
          quantity: item.quantity,
          price: item.price
        };
      });

      console.log("Creating order items:", orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      console.log("Order items created successfully");

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
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod,
        subtotal: subtotal,
        shipping: shipping,
        total: total
      };

      console.log("Setting order context data:", orderContextData);

      // Save order data in context
      setCurrentOrder(orderContextData);
      addToOrderHistory(orderContextData);
      
      // Clear cart and navigate
      console.log("Clearing cart and navigating to confirmation");
      await clearCart();
      
      toast.success("Payment successful! Your order has been placed.");
      navigate("/order-confirmation");

    } catch (error) {
      console.error('Error in payment processing:', error);
      if (error instanceof Error) {
        toast.error(`Payment failed: ${error.message}`);
      } else {
        toast.error('Payment failed. Please try again.');
      }
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
