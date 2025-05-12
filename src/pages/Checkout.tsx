
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import { ShippingFormValues, PaymentFormValues } from "@/components/checkout/validation-schemas";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [checkoutStep, setCheckoutStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);
  
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

  const handlePaymentSubmit = (values: PaymentFormValues) => {
    // In a real app, this would connect to a payment processor
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
    
    setTimeout(() => {
      toast.success("Payment successful! Your order has been placed.");
      clearCart();
      navigate("/order-confirmation");
    }, 2000);
  };

  // Calculate shipping cost based on method
  const getShippingCost = () => {
    switch (shippingMethod) {
      case "express":
        return 1199;
      case "next-day":
        return 1999;
      default:
        return 399;
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
