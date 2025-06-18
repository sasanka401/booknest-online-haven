
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const handleIncreaseQuantity = (id: number, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  // Function to format price in INR
  const formatPriceInINR = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="py-16 px-4 container mx-auto flex-grow">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
            <Button asChild>
              <a href="/#book-section">Browse Books</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 border-b">
                <div className="col-span-3 font-medium">Product</div>
                <div className="text-center font-medium">Price</div>
                <div className="text-center font-medium">Quantity</div>
                <div className="text-center font-medium">Total</div>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b items-center">
                  <div className="col-span-1 md:col-span-3 flex gap-4">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.author}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm flex items-center gap-1 mt-2"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:text-center">
                    <span className="md:hidden font-medium">Price: </span>
                    <span>{formatPriceInINR(item.price)}</span>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="px-3 py-1 border-r"
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 border-l"
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:text-center">
                    <span className="md:hidden font-medium">Total: </span>
                    <span className="font-semibold">{formatPriceInINR(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmDialogOpen(true)}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Clear Cart
              </Button>
              
              <div className="bg-white rounded-lg shadow-md p-6 min-w-[300px]">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{formatPriceInINR(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>{formatPriceInINR(getTotalPrice())}</span>
                </div>
                <Button 
                  className="w-full mt-4" 
                  asChild
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
      
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear your cart?</DialogTitle>
            <DialogDescription>
              This will remove all items from your cart. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                clearCart();
                setIsConfirmDialogOpen(false);
              }}
            >
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
