import React from "react";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";
import AdminDashboard from "./pages/AdminDashboard";

// Import pages
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OrderConfirmation from "./pages/OrderConfirmation";
import NearbyBookstores from "./pages/NearbyBookstores";
import ResellBooks from "./pages/ResellBooks";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

// Wrapper to protect routes that require login
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  return user ? children : <Navigate to="/auth" replace />;
}

// Admin-only route wrapper (inline)
function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let stopped = false;
    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        if (!stopped) setIsAdmin(data?.role === "admin");
      } catch (e) {
        setIsAdmin(false);
      }
    })();
    return () => {
      stopped = true;
    };
  }, [user]);

  if (loading || isAdmin === null) {
    return <div className="flex min-h-screen items-center justify-center">Checking admin permissions...</div>;
  }
  return user && isAdmin ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                {/* --- Add admin dashboard protected route here --- */}
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                {/* Protect routes as needed */}
                <Route path="/" element={<Index />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                } />
                <Route path="/login" element={<Navigate to="/auth" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/order-confirmation" element={
                  <PrivateRoute>
                    <OrderConfirmation />
                  </PrivateRoute>
                } />
                <Route path="/order/:orderId" element={
                  <PrivateRoute>
                    <OrderDetails />
                  </PrivateRoute>
                } />
                <Route path="/nearby-bookstores" element={<NearbyBookstores />} />
                <Route path="/resell" element={
                  <PrivateRoute>
                    <ResellBooks />
                  </PrivateRoute>
                } />
                <Route path="/wishlist" element={
                  <PrivateRoute>
                    <Wishlist />
                  </PrivateRoute>
                } />
                <Route path="/order-history" element={
                  <PrivateRoute>
                    <OrderHistory />
                  </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OrderProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
