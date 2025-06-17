import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "./client"; // Removed Supabase client import

// Mock data for books
const mockBooks = JSON.parse(localStorage.getItem('mockBooks') || '[]') || [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 25.00, image_url: 'https://images-na.ssl-images-amazon.com/images/I/41K-vF7NhmL._SX331_BO1,204,203,200_.jpg', rating: 4.5, stock: 10, language: 'English', created_at: new Date().toISOString() },
  { id: 2, title: '1984', author: 'George Orwell', price: 18.50, image_url: 'https://images-na.ssl-images-amazon.com/images/I/41-D9E2F-6L._SX331_BO1,204,203,200_.jpg', rating: 4.8, stock: 5, language: 'English', created_at: new Date().toISOString() },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 22.00, image_url: 'https://images-na.ssl-images-amazon.com/images/I/413J7o6g4UL._SX331_BO1,204,203,200_.jpg', rating: 4.7, stock: 12, language: 'English', created_at: new Date().toISOString() },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 15.75, image_url: 'https://images-na.ssl-images-amazon.com/images/I/415o9f8zNGL._SX331_BO1,204,203,200_.jpg', rating: 4.6, stock: 8, language: 'English', created_at: new Date().toISOString() },
];

// Helper to save mock books to localStorage
const saveMockBooks = (books) => {
  localStorage.setItem('mockBooks', JSON.stringify(books));
};

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image_url: string | null;
  rating: number | null;
  stock: number;
  language: string | null;
  created_at: string;
}

// Mock fetch function for books
const fetchBooks = async (): Promise<Book[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return JSON.parse(localStorage.getItem('mockBooks') || '[]') || mockBooks;
};

// Mock add book function
const addBook = async (newBook: Omit<Book, "id" | "created_at">): Promise<Book> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentBooks: Book[] = JSON.parse(localStorage.getItem('mockBooks') || '[]') || mockBooks;
  const id = currentBooks.length > 0 ? Math.max(...currentBooks.map(b => b.id)) + 1 : 1;
  const bookToAdd: Book = { ...newBook, id, created_at: new Date().toISOString(), stock: newBook.stock || 1 };
  const updatedBooks = [...currentBooks, bookToAdd];
  saveMockBooks(updatedBooks);
  return bookToAdd;
};

// Mock update book function
const updateBook = async (updatedBook: Book): Promise<Book> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentBooks: Book[] = JSON.parse(localStorage.getItem('mockBooks') || '[]') || mockBooks;
  const updatedBooks = currentBooks.map(book => 
    book.id === updatedBook.id ? { ...book, ...updatedBook } : book
  );
  saveMockBooks(updatedBooks);
  return updatedBook;
};

// Mock delete book function
const deleteBook = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentBooks: Book[] = JSON.parse(localStorage.getItem('mockBooks') || '[]') || mockBooks;
  const updatedBooks = currentBooks.filter(book => book.id !== id);
  saveMockBooks(updatedBooks);
};

export const useBooks = () => {
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return {
    books: booksQuery.data || [],
    isLoading: booksQuery.isLoading,
    error: booksQuery.error,
    addBook: addMutation.mutate,
    updateBook: updateMutation.mutate,
    deleteBook: deleteMutation.mutate,
  };
};
