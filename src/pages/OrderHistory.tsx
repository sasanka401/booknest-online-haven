import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useOrder } from "@/context/OrderContext";
import { Package, IndianRupee, Calendar, Search, Trash2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const OrderHistory = () => {
  const { orderHistory, removeOrder, clearOrderHistory } = useOrder();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);

  // Filter orders based on search term
  const filteredOrders = orderHistory.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRemoveOrder = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmRemoveOrder = () => {
    if (orderToDelete) {
      removeOrder(orderToDelete);
      toast.success("Order removed from history");
      setOrderToDelete(null);
    }
  };

  const handleClearHistory = () => {
    setShowClearHistoryDialog(true);
  };

  const confirmClearHistory = () => {
    clearOrderHistory();
    toast.success("Order history cleared");
    setShowClearHistoryDialog(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto py-10 px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Order History</h1>
            <div className="flex gap-4">
              {orderHistory.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleClearHistory}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear History
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search by order number or book title..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm ? "Try a different search term" : "Start shopping to see your orders here"}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/">Start Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.orderNumber} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
                        <div className="flex items-center text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{order.orderDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                          order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                          order.status === "Delivered" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveOrder(order.orderNumber)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/order/${order.orderNumber}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.title}</h3>
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

                    {order.items.length > 2 && (
                      <div className="mt-4 text-center">
                        <p className="text-gray-500">
                          +{order.items.length - 2} more items
                        </p>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">Total Items</p>
                          <p className="font-medium">{order.items.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* Remove Order Confirmation Dialog */}
      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this order from your history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveOrder}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear History Confirmation Dialog */}
      <AlertDialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Order History</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your entire order history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmClearHistory}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderHistory; 