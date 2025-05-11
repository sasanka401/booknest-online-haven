
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PackageCheck, CheckCircle, IndianRupee } from "lucide-react";

const OrderConfirmation = () => {
  // Generate a random order number
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto py-16 px-4 flex-grow flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Order Confirmed Successfully!</h1>
          <p className="text-xl mb-6">Thank you for your purchase</p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-8">
            <p className="text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-semibold">{orderNumber}</p>
          </div>
          
          <p className="mb-2 text-gray-600">
            We've sent a confirmation email with your order details and tracking information.
          </p>
          <p className="mb-8 text-gray-600">
            You'll receive another email when your order ships.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">Continue Shopping</Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to={`/order/${orderNumber}`}>View Order</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
