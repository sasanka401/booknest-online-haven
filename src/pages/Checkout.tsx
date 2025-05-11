
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreditCard, Package, Truck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
  cardName: z.string().min(2, { message: "Name on card must be at least 2 characters" }),
  cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }).max(16),
  expiryDate: z.string().min(5, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string().min(3, { message: "CVV must be at least 3 digits" }).max(4),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");
  
  // Check if cart is empty and redirect to cart page if it is
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would connect to a payment processor
    console.log("Form submitted with values:", values);
    
    // Simulate processing payment
    toast.info("Processing payment...");
    
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-confirmation");
    }, 2000);
  };

  // Calculate shipping cost based on method
  const getShippingCost = () => {
    switch (shippingMethod) {
      case "express":
        return 14.99;
      case "next-day":
        return 24.99;
      default:
        return 4.99;
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-1 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.title} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Shipping Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Shipping Method */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Shipping Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        shippingMethod === "standard" 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => setShippingMethod("standard")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Truck size={18} className="mr-2" />
                          <span className="font-medium">Standard</span>
                        </div>
                        <span className="text-sm font-semibold">$4.99</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery in 3-5 business days</p>
                    </div>
                    
                    <div
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        shippingMethod === "express" 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => setShippingMethod("express")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Package size={18} className="mr-2" />
                          <span className="font-medium">Express</span>
                        </div>
                        <span className="text-sm font-semibold">$14.99</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery in 1-2 business days</p>
                    </div>
                    
                    <div
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        shippingMethod === "next-day" 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => setShippingMethod("next-day")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Truck size={18} className="mr-2" />
                          <span className="font-medium">Next Day</span>
                        </div>
                        <span className="text-sm font-semibold">$24.99</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivered by tomorrow</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                  
                  <div className="flex items-center mb-4">
                    <CreditCard size={20} className="mr-2" />
                    <span className="font-medium">Credit Card</span>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Place Order - ${total.toFixed(2)}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
