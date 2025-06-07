import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";

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

function App() {
  return (
    <Router>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />
              <Route path="/nearby-bookstores" element={<NearbyBookstores />} />
              <Route path="/resell" element={<ResellBooks />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </Router>
  );
}

export default App;
