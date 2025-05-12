
import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, Heart, IndianRupee, Trash2 } from "lucide-react";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

          {getWishlistCount() === 0 ? (
            <div className="text-center py-10">
              <Heart className="mx-auto mb-4 text-gray-400" size={48} />
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Explore our collection and add items you love to your wishlist
              </p>
              <Link 
                to="/" 
                className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Explore Books
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((book) => (
                  <div 
                    key={book.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all hover:shadow-lg"
                  >
                    <img src={book.imageUrl} alt={book.title} className="w-full h-56 object-cover" />
                    <div className="p-4 space-y-2 flex-1">
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <IndianRupee size={14} />
                        {book.price.toFixed(0)}
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 flex justify-between">
                      <button 
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          addToCart(book);
                        }}
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        className="flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:text-red-500 transition-colors"
                        onClick={() => removeFromWishlist(book.id)}
                      >
                        <Trash2 size={16} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
