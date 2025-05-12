
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

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

function App() {
  return (
    <Router>
      <WishlistProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/nearby-bookstores" element={<NearbyBookstores />} />
            <Route path="/resell" element={<ResellBooks />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </Router>
  );
}

export default App;
