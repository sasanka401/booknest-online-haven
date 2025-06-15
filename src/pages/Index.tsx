import { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingCart, Heart, IndianRupee } from "lucide-react";
import AdminDashboard from "@/pages/AdminDashboard";
import { useBooks } from "@/integrations/supabase/useBooks";

// Book data type
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image_url: string | null;
  rating: number | null;
  language?: string | null;
}

// Add this new component at the top of the file, after the imports
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {isVisible && 
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      }
    </>
  );
};

const Index = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Fetch books from Supabase
  const { data: books, isLoading, error } = useBooks();

  // Group books by language
  const booksByLanguage = (books || []).reduce(
    (acc: Record<string, Book[]>, book: Book) => {
      const lang = book.language?.toLowerCase() || "other";
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push(book);
      return acc;
    },
    {}
  );

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

  const handleAddToCart = (book: Book) => {
    addToCart(book);
  };

  const handleToggleWishlist = (book: Book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  // Scroll animations (can skip for brevity in code sample)
  useEffect(() => {
    if (books && books.length) {
      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      };
      const observer = new IntersectionObserver(handleIntersection, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      setTimeout(() => {
        const bookCards = document.querySelectorAll('.book-card');
        bookCards.forEach(card => {
          observer.observe(card);
        });
      }, 100);
      return () => {
        const bookCards = document.querySelectorAll('.book-card');
        bookCards.forEach(card => {
          observer.unobserve(card);
        });
      };
    }
  }, [books]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="hero">
        <div className="container hero-content">
          <h2>Discover Your Next Great Read</h2>
          <p>Explore our collection of bestselling books across all genres</p>
          <a href="#book-section" className="btn-primary">Browse Books</a>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a 
              href="#assamese-books" 
              className="px-6 py-2 rounded-lg font-bold text-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('assamese-books')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Assamese Books
            </a>
            <a 
              href="#hindi-books" 
              className="px-6 py-2 rounded-lg font-bold text-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('hindi-books')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Hindi Books
            </a>
            <a 
              href="#english-books" 
              className="px-6 py-2 rounded-lg font-bold text-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('english-books')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              English Books
            </a>
          </div>
        </div>
      </section>

      <main className="book-section" id="book-section">
        <div className="container">
          <h2 className="section-title text-center">Featured Books</h2>
          {isLoading && <div className="text-center my-12">Loading books...</div>}
          {error && (
            <div className="text-center text-red-500 my-12">
              Error loading books. Please try again.
            </div>
          )}
          {!isLoading && !error && books && books.length > 0 && (
            <div className="book-grid" id="book-list">
              {books.slice(0, 6).map((book) => (
                <div 
                  key={book.id} 
                  className="book-card opacity-0"
                  style={{ animationDelay: `${book.id * 0.1}s` }}
                >
                  <img src={book.image_url ?? "/placeholder.svg"} alt={book.title} className="book-image" />
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-price flex items-center gap-1">
                      <IndianRupee size={14} />
                      {book.price?.toFixed?.(0)}
                    </div>
                    <div className="book-rating">
                      {renderStars(book.rating)}
                      <span className="ml-1 text-sm text-gray-600">({book.rating ?? "N/A"})</span>
                    </div>
                    <div className="book-actions">
                      <button 
                        className="add-to-cart flex items-center gap-1"
                        onClick={() => handleAddToCart(book)}
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        className={`add-to-wishlist ${isInWishlist(book.id) ? 'text-red-500' : 'text-gray-400'}`}
                        onClick={() => handleToggleWishlist(book)}
                        aria-label={isInWishlist(book.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart size={20} fill={isInWishlist(book.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isLoading && books?.length === 0 && (
            <div className="text-center my-12 text-gray-500">No books found.</div>
          )}

          {/* Assamese Books Section */}
          <h2 className="section-title text-center mt-16" id="assamese-books">Assamese Books</h2>
          <div className="book-grid" id="assamese-book-list">
            {booksByLanguage.assamese && booksByLanguage.assamese.length > 0 ? (
              booksByLanguage.assamese.map((book) => (
                <div 
                  key={book.id} 
                  className="book-card opacity-0" 
                  style={{ animationDelay: `${book.id * 0.1}s` }}
                >
                  <img src={book.image_url ?? "/placeholder.svg"} alt={book.title} className="book-image" />
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-price flex items-center gap-1">
                      <IndianRupee size={14} />
                      {book.price?.toFixed?.(0)}
                    </div>
                    <div className="book-rating">
                      {renderStars(book.rating)}
                      <span className="ml-1 text-sm text-gray-600">({book.rating ?? "N/A"})</span>
                    </div>
                    <div className="book-actions">
                      <button 
                        className="add-to-cart flex items-center gap-1"
                        onClick={() => handleAddToCart(book)}
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        className={`add-to-wishlist ${isInWishlist(book.id) ? 'text-red-500' : 'text-gray-400'}`}
                        onClick={() => handleToggleWishlist(book)}
                        aria-label={isInWishlist(book.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart size={20} fill={isInWishlist(book.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center my-8 text-gray-500">No Assamese books found.</div>
            )}
          </div>

          {/* Hindi Books Section */}
          <h2 className="section-title text-center mt-16" id="hindi-books">Hindi Books</h2>
          <div className="book-grid" id="hindi-book-list">
            {booksByLanguage.hindi && booksByLanguage.hindi.length > 0 ? (
              booksByLanguage.hindi.map((book) => (
                <div 
                  key={book.id} 
                  className="book-card opacity-0" 
                  style={{ animationDelay: `${book.id * 0.1}s` }}
                >
                  <img src={book.image_url ?? "/placeholder.svg"} alt={book.title} className="book-image" />
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-price flex items-center gap-1">
                      <IndianRupee size={14} />
                      {book.price?.toFixed?.(0)}
                    </div>
                    <div className="book-rating">
                      {renderStars(book.rating)}
                      <span className="ml-1 text-sm text-gray-600">({book.rating ?? "N/A"})</span>
                    </div>
                    <div className="book-actions">
                      <button 
                        className="add-to-cart flex items-center gap-1"
                        onClick={() => handleAddToCart(book)}
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        className={`add-to-wishlist ${isInWishlist(book.id) ? 'text-red-500' : 'text-gray-400'}`}
                        onClick={() => handleToggleWishlist(book)}
                        aria-label={isInWishlist(book.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart size={20} fill={isInWishlist(book.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center my-8 text-gray-500">No Hindi books found.</div>
            )}
          </div>

          {/* English Books Section */}
          <h2 className="section-title text-center mt-16" id="english-books">English Books</h2>
          <div className="book-grid" id="english-book-list">
            {booksByLanguage.english && booksByLanguage.english.length > 0 ? (
              booksByLanguage.english.map((book) => (
                <div 
                  key={book.id} 
                  className="book-card opacity-0" 
                  style={{ animationDelay: `${book.id * 0.1}s` }}
                >
                  <img src={book.image_url ?? "/placeholder.svg"} alt={book.title} className="book-image" />
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-price flex items-center gap-1">
                      <IndianRupee size={14} />
                      {book.price?.toFixed?.(0)}
                    </div>
                    <div className="book-rating">
                      {renderStars(book.rating)}
                      <span className="ml-1 text-sm text-gray-600">({book.rating ?? "N/A"})</span>
                    </div>
                    <div className="book-actions">
                      <button 
                        className="add-to-cart flex items-center gap-1"
                        onClick={() => handleAddToCart(book)}
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>
                      <button 
                        className={`add-to-wishlist ${isInWishlist(book.id) ? 'text-red-500' : 'text-gray-400'}`}
                        onClick={() => handleToggleWishlist(book)}
                        aria-label={isInWishlist(book.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart size={20} fill={isInWishlist(book.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center my-8 text-gray-500">No English books found.</div>
            )}
          </div>

          {/* Pagination below English Books */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />

      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </div>
  );
};

export default Index;
