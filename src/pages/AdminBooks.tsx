import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
// import { supabase } from "@/integrations/supabase/client"; // Removed Supabase client import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner"; // Changed from @/hooks/use-toast to sonner
import { BookPlus, Trash2, Edit } from "lucide-react"; // Added Edit icon
import { useBooks, Book } from "@/integrations/supabase/useBooks"; // Using mock useBooks
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, useParams } from "react-router-dom"; // Added for edit functionality

const AdminBooks = () => {
  const { user } = useAuth();
  const { books, isLoading, error, addBook, updateBook, deleteBook } = useBooks();
  const navigate = useNavigate();
  const { bookId } = useParams(); // Get bookId from URL for editing

  const [form, setForm] = useState<{ 
    id?: number; 
    title: string; 
    author: string; 
    price: string; 
    image_url: string; 
    rating: string; 
    stock: string; 
    language?: string; // Optional for form, will default on submit if not provided
    created_at?: string; // To carry over for updates
  }> ({
    title: "",
    author: "",
    price: "",
    image_url: "",
    rating: "",
    stock: "", // Initialize as empty string
    language: "English",
    created_at: undefined,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load book data for editing
  React.useEffect(() => {
    if (bookId) {
      const bookToEdit = books.find(book => book.id === parseInt(bookId));
      if (bookToEdit) {
        setForm({
          id: bookToEdit.id,
          title: bookToEdit.title,
          author: bookToEdit.author,
          price: bookToEdit.price.toString(),
          image_url: bookToEdit.image_url || "",
          rating: bookToEdit.rating?.toString() || "",
          stock: bookToEdit.stock.toString(), // Convert to string
          language: bookToEdit.language || "English", // Carry over or default
          created_at: bookToEdit.created_at, // Carry over
        });
        setIsEditing(true);
      } else {
        toast.error("Book not found for editing.");
        navigate("/admin/books");
      }
    } else {
      setIsEditing(false);
      setForm({
        title: "", author: "", price: "", image_url: "", rating: "", stock: "", // Reset to empty strings
        language: "English",
        created_at: undefined,
      });
    }
  }, [bookId, books, navigate]);

  // Simulate isAdmin check (mocked based on mock auth context)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  React.useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    // In a real app, you'd check user roles via Supabase here. 
    // For mock, we rely on the mock user ID from AuthContext
    setIsAdmin(user.id === "mock-admin-id-456"); 
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = parseFloat(form.price);
    const parsedRating = form.rating ? parseFloat(form.rating) : null;
    const parsedStock = parseInt(form.stock, 10); // Use parseInt for stock

    if (isNaN(parsedPrice) || isNaN(parsedStock) || (form.rating && isNaN(parsedRating!))) {
      toast.error("Please enter valid numbers for Price, Stock, and Rating.");
      return;
    }

    // Base book data for both add and update, with parsed numbers
    const baseBookData = {
      title: form.title,
      author: form.author,
      price: parsedPrice,
      image_url: form.image_url || null,
      rating: parsedRating,
      stock: parsedStock,
      language: form.language || "English", // Ensure language is included
    };

    if (isEditing && form.id) {
      // For update, create a full Book object including id and created_at
      const updatedBook: Book = {
        ...baseBookData,
        id: form.id,
        created_at: form.created_at || new Date().toISOString(), // Use existing or default
      };
      updateBook(updatedBook);
      toast.success("Book updated!");
      navigate("/admin/books");
    } else {
      // For add, use the type expected by addBook (Omit<Book, "id" | "created_at">)
      const newBookData: Omit<Book, "id" | "created_at"> = {
        ...baseBookData,
        // id and created_at will be generated by addBook in useBooks.ts
      };
      addBook(newBookData);
      toast.success("Book added!");
      setForm({ title: "", author: "", price: "", image_url: "", rating: "", stock: "", language: "English", created_at: undefined });
    }
  };

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBook(id);
      toast.success("Book deleted!");
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span>Checking permissions...</span>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-destructive">Access denied: Admins only</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/50">
      <Header />
      <main className="flex flex-1 flex-col items-center py-8">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookPlus /> Admin: {isEditing ? "Edit Book" : "Manage Books"}
          </h1>
          <form
            className="bg-white rounded-md shadow p-6 flex flex-col gap-4 mb-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                name="title"
                value={form.title}
                placeholder="Title"
                onChange={handleChange}
                required
              />
              <Input
                name="author"
                value={form.author}
                placeholder="Author"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                name="price"
                value={form.price}
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                onChange={handleChange}
                required
              />
              <Input
                name="stock"
                value={form.stock}
                placeholder="Stock"
                type="number"
                min="0"
                onChange={handleChange}
                required
              />
              <Input
                name="rating"
                value={form.rating}
                placeholder="Rating (optional)"
                type="number"
                min="0"
                max="5"
                step="0.1"
                onChange={handleChange}
              />
            </div>
            <Input
              name="image_url"
              value={form.image_url}
              placeholder="Image URL (optional)"
              onChange={handleChange}
            />
            <Button type="submit" disabled={isLoading}>
              {isEditing ? "Update Book" : "Add Book"}
            </Button>
          </form>

          {!isEditing && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Book List</h2>
              {isLoading ? (
                <div>Loading books...</div>
              ) : error ? (
                <div className="text-destructive">Error loading books.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>₹{parseFloat(book.price.toString()).toFixed(2)}</TableCell>
                        <TableCell>{book.stock}</TableCell>
                        <TableCell>{book.rating ?? "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              title="Edit"
                              onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              title="Delete"
                              onClick={() => handleDelete(book.id, book.title)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminBooks;
