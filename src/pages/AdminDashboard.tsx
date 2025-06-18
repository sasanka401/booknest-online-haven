import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Order {
  id: number;
  order_number: string;
  order_date: string;
  status: string;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  total: number;
}

interface ResellBook {
  id: number;
  book_title: string;
  book_author: string;
  price: number;
  condition: string;
  description: string;
  image_url: string | null;
  seller_id: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [resellBooks, setResellBooks] = useState<ResellBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      navigate("/admin");
      return;
    }

    fetchOrders();
    fetchResellBooks();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("order_date", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the Order interface
      const transformedOrders = (data || []).map(order => ({
        ...order,
        shipping_address: typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address)
          : order.shipping_address
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResellBooks = async () => {
    try {
      const { data, error } = await supabase
        .from("resell_books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResellBooks(data || []);
    } catch (error) {
      console.error("Error fetching resell books:", error);
      toast.error("Failed to fetch resell books");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    navigate("/admin");
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order status updated");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleResellBookAction = async (bookId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        // Add the book to the main books table
        const book = resellBooks.find(b => b.id === bookId);
        if (!book) return;

        const { error: insertError } = await supabase
          .from("books")
          .insert([{
            title: book.book_title,
            author: book.book_author,
            price: book.price,
            image_url: book.image_url,
            condition: book.condition
          }]);

        if (insertError) throw insertError;
      }

      // Delete from resell_books table
      const { error: deleteError } = await supabase
        .from("resell_books")
        .delete()
        .eq("id", bookId);

      if (deleteError) throw deleteError;

      toast.success(`Book ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchResellBooks(); // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing book:`, error);
      toast.error(`Failed to ${action} book`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Current Orders</TabsTrigger>
            <TabsTrigger value="resell">Resell Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {isLoading ? (
              <div className="text-center py-10">Loading orders...</div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(order.order_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{order.shipping_address.name}</div>
                              <div className="text-sm text-gray-500">
                                {order.shipping_address.city}, {order.shipping_address.state}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                              aria-label="Update order status"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resell">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resellBooks.map((book) => (
                      <tr key={book.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {book.image_url && (
                              <img
                                src={book.image_url}
                                alt={book.book_title}
                                className="h-10 w-10 rounded-full object-cover mr-3"
                              />
                            )}
                            <div className="font-medium">{book.book_title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {book.book_author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{book.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {book.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {book.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleResellBookAction(book.id, 'approve')}
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleResellBookAction(book.id, 'reject')}
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
