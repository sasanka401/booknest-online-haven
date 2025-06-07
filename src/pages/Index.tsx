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

// Book data type
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  rating: number;
}

// Sample Assamese books data
const assameseBooks: Book[] = [
  {
    id: 101,
    title: "অসমীয়া সাহিত্যৰ ইতিবৃত্ত (History of Assamese Literature)",
    author: "Dr. Banikanta Kakati",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    rating: 4.7
  },
  {
    id: 102,
    title: "জোনাকী (Jonaki)",
    author: "Lakshminath Bezbaroa",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    rating: 4.5
  },
  {
    id: 103,
    title: "মোৰ জীৱন-স্মৃতি (Mor Jibon Smriti)",
    author: "Hemchandra Goswami",
    price: 350,
    imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    rating: 4.6
  },
  {
    id: 104,
    title: "অসমীয়া কাব্য (Assamese Poetry)",
    author: "Nalinibala Devi",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1455885664032-7c937c0d3a19?auto=format&fit=crop&w=400&q=80",
    rating: 4.4
  }
];

// Sample Hindi books data
const hindiBooks: Book[] = [
  {
    id: 201,
    title: "गोदान (Godaan)",
    author: "Munshi Premchand",
    price: 450,
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
    rating: 4.8
  },
  {
    id: 202,
    title: "गुनाहों का देवता (Gunahon Ka Devta)",
    author: "Dharamvir Bharati",
    price: 380,
    imageUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
    rating: 4.6
  },
  {
    id: 203,
    title: "राग दरबारी (Raag Darbari)",
    author: "Shrilal Shukla",
    price: 420,
    imageUrl: "https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=400&q=80",
    rating: 4.7
  },
  {
    id: 204,
    title: "तमस (Tamas)",
    author: "Bhisham Sahni",
    price: 390,
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80",
    rating: 4.5
  }
];

// Sample English books data
const englishBooks: Book[] = [
  {
    id: 301,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 550,
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
    rating: 4.9
  },
  {
    id: 302,
    title: "1984",
    author: "George Orwell",
    price: 480,
    imageUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
    rating: 4.8
  },
  {
    id: 303,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 500,
    imageUrl: "https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=400&q=80",
    rating: 4.7
  },
  {
    id: 304,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 470,
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80",
    rating: 4.6
  }
];

// Featured Books: a mix from Assamese, Hindi, and English books
const booksData: Book[] = [
  assameseBooks[0],
  assameseBooks[1],
  hindiBooks[0],
  hindiBooks[1],
  englishBooks[0],
  englishBooks[1],
];

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
  const [books, setBooks] = useState<Book[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Simulate loading books from an API
    const loadBooks = () => {
      setBooks(booksData);
    };
    
    loadBooks();
    
    // Add scroll event for animations
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
  }, []);

  // Generate rating stars
  const renderStars = (rating: number) => {
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
          <div className="book-grid" id="book-list">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="book-card opacity-0" 
                style={{ animationDelay: `${book.id * 0.1}s` }}
              >
                <img src={book.imageUrl} alt={book.title} className="book-image" />
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-price flex items-center gap-1">
                    <IndianRupee size={14} />
                    {book.price.toFixed(0)}
                  </div>
                  <div className="book-rating">
                    {renderStars(book.rating)}
                    <span className="ml-1 text-sm text-gray-600">({book.rating})</span>
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

          {/* Assamese Books Section */}
          <h2 className="section-title text-center mt-16" id="assamese-books">Assamese Books</h2>
          <div className="book-grid" id="assamese-book-list">
            {assameseBooks.map((book) => (
              <div 
                key={book.id} 
                className="book-card opacity-0" 
                style={{ animationDelay: `${book.id * 0.1}s` }}
              >
                <img src={book.imageUrl} alt={book.title} className="book-image" />
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-price flex items-center gap-1">
                    <IndianRupee size={14} />
                    {book.price.toFixed(0)}
                  </div>
                  <div className="book-rating">
                    {renderStars(book.rating)}
                    <span className="ml-1 text-sm text-gray-600">({book.rating})</span>
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

          {/* Hindi Books Section */}
          <h2 className="section-title text-center mt-16" id="hindi-books">Hindi Books</h2>
          <div className="book-grid" id="hindi-book-list">
            {hindiBooks.map((book) => (
              <div 
                key={book.id} 
                className="book-card opacity-0" 
                style={{ animationDelay: `${book.id * 0.1}s` }}
              >
                <img src={book.imageUrl} alt={book.title} className="book-image" />
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-price flex items-center gap-1">
                    <IndianRupee size={14} />
                    {book.price.toFixed(0)}
                  </div>
                  <div className="book-rating">
                    {renderStars(book.rating)}
                    <span className="ml-1 text-sm text-gray-600">({book.rating})</span>
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

          {/* English Books Section */}
          <h2 className="section-title text-center mt-16" id="english-books">English Books</h2>
          <div className="book-grid" id="english-book-list">
            {englishBooks.map((book) => (
              <div 
                key={book.id} 
                className="book-card opacity-0" 
                style={{ animationDelay: `${book.id * 0.1}s` }}
              >
                <img src={book.imageUrl} alt={book.title} className="book-image" />
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-price flex items-center gap-1">
                    <IndianRupee size={14} />
                    {book.price.toFixed(0)}
                  </div>
                  <div className="book-rating">
                    {renderStars(book.rating)}
                    <span className="ml-1 text-sm text-gray-600">({book.rating})</span>
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
