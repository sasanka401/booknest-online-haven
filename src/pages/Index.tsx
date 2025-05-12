
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

// Sample books data
const booksData: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 999,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    rating: 4.5
  },
  {
    id: 2,
    title: "Educated",
    author: "Tara Westover",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    rating: 4.8
  },
  {
    id: 3,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 949,
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1076&q=80",
    rating: 4.3
  },
  {
    id: 4,
    title: "Atomic Habits",
    author: "James Clear",
    price: 799,
    imageUrl: "https://images.unsplash.com/photo-1598618253208-d75408cee680?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.7
  },
  {
    id: 5,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 1099,
    imageUrl: "https://images.unsplash.com/photo-1531901599143-df8149257c99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1981&q=80",
    rating: 4.6
  },
  {
    id: 6,
    title: "Becoming",
    author: "Michelle Obama",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=683&q=80",
    rating: 4.9
  },
  {
    id: 7,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    rating: 4.8
  },
  {
    id: 8,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    price: 749,
    imageUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6752c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.9
  }
];

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
