import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, IndianRupee, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (book: any) => {
    addToCart(book);
  };

  const handleRemoveFromWishlist = (bookId: string) => {
    removeFromWishlist(bookId);
  };

  // Generate rating stars
  const renderStars = (rating: number | null) => {
    if (!rating) return (
      <>
        {[...Array(5)].map((_, i) => (
          <span key={`star-empty-${i}`} className="text-gray-300">☆</span>
        ))}
      </>
    );
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="rating-star">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="rating-star">☆</span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }
    return stars;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-gray-600">
            Books you've saved for later ({wishlistItems.length} items)
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start browsing and add books you'd like to read later
            </p>
            <Link to="/">
              <Button className="px-6 py-3">
                Browse Books
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((book) => (
              <div key={book.id} className="book-card relative">
                <Button
                  onClick={() => handleRemoveFromWishlist(book.id)}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  title="Remove from wishlist"
                >
                  <X size={16} />
                </Button>
                
                <img 
                  src={book.image_url ?? "/placeholder.svg"} 
                  alt={book.title} 
                  className="book-image" 
                />
                
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-price flex items-center gap-1">
                    <IndianRupee size={14} />
                    {book.price?.toFixed?.(0)}
                  </div>
                  <div className="book-rating">{renderStars(book.rating)}</div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={() => handleAddToCart(book)} 
                      className="flex-grow"
                      title="Add to Cart"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
