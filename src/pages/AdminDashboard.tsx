import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Package,
  Users,
  PlusCircle,
  BarChart3,
  BookPlus,
  Trash2,
  Edit,
  Search,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image_url: string | null;
  rating: number | null;
  language: string | null;
  stock: number;
  created_at: string;
}

interface Order {
  id: number;
  order_number: string;
  order_date: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  shipping_method: string;
  shipping_address: any;
  user_id: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch books and orders using the mock Supabase client
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books from mock Supabase
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false }).then(res => res);

        if (booksError) throw booksError;
        setBooks(booksData as Book[] || []);

        // Fetch orders from mock Supabase
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }).then(res => res);

        if (ordersError) throw ordersError;
        setOrders(ordersData as Order[] || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalBooks = books.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockBooks = books.filter(book => book.stock < 5).length;

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter orders based on status
  const filteredOrders = orders.filter(order =>
    filterStatus === "all" ? true : order.status === filterStatus
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header with Add Book button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/admin/books/new" className="flex items-center gap-2">
                <BookPlus className="w-4 h-4" />
                Add New Book
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBooks}</div>
              <p className="text-xs text-muted-foreground">
                Books in inventory
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total sales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockBooks}</div>
              <p className="text-xs text-muted-foreground">
                Books need restocking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Books Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Books</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>₹{book.price.toFixed(2)}</TableCell>
                    <TableCell>{book.stock}</TableCell>
                    <TableCell>{book.rating || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Link to={`/admin/books/edit/${book.id}`}><Edit className="w-4 h-4" /></Link>
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>{order.user_id}</TableCell>
                    <TableCell>₹{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(order.order_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
