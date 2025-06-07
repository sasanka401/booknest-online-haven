import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, IndianRupee, MapPin, Phone, Mail, Truck } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useEffect } from "react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, getOrderById } = useOrder();

  // Get order from either current order or order history
  const order = currentOrder?.orderNumber === orderId ? currentOrder : getOrderById(orderId!);

  // Redirect if no order data is available
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto py-10 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <Button variant="outline" asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Order Number</p>
                <p className="text-xl font-semibold">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="text-xl font-semibold">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="text-xl font-semibold text-primary">{order.status}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-600">by {item.author}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping Address
                </h3>
                <div className="text-gray-600">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.pinCode}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Information
                </h3>
                <div className="text-gray-600">
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({order.shippingMethod})</span>
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {order.shipping.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetails; 