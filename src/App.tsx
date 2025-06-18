import React from "react";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import PrivateRoute from "./components/PrivateRoute";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OrderConfirmation from "./pages/OrderConfirmation";
import NearbyBookstores from "./pages/NearbyBookstores";
import ResellBooks from "./pages/ResellBooks";
import NotFound from "./pages/NotFound";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Navigate to="/auth" />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/order-confirmation" element={
                <PrivateRoute>
                  <OrderConfirmation />
                </PrivateRoute>
              } />
              <Route path="/nearby-bookstores" element={<NearbyBookstores />} />
              <Route path="/resell-books" element={
                <PrivateRoute>
                  <ResellBooks />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/order/:orderId" element={
                <PrivateRoute>
                  <OrderDetails />
                </PrivateRoute>
              } />
              <Route path="/order-history" element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              } />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
