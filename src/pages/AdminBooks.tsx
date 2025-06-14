
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { BookPlus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fetchBooks = async () => {
  const { data, error } = await supabase.from("books").select("*").order("id", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const addBook = async (book: { title: string; author: string; price: number; image_url?: string; rating?: number }) => {
  const { error } = await supabase.from("books").insert([book]);
  if (error) throw new Error(error.message);
};

const deleteBook = async (id: number) => {
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

const AdminBooks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<{ title: string; author: string; price: string; image_url: string; rating: string }>({
    title: "",
    author: "",
    price: "",
    image_url: "",
    rating: "",
  });

  // replace this with your own real admin-role hook
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setIsAdmin(false);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      setIsAdmin(data?.role === "admin");
    };
    checkAdmin();
  }, [user]);

  const booksQuery = useQuery({
    queryKey: ["books-admin"],
    queryFn: fetchBooks,
  });

  const addBookMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      toast.success("Book added!");
      queryClient.invalidateQueries({ queryKey: ["books-admin"] });
      setForm({ title: "", author: "", price: "", image_url: "", rating: "" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      toast.success("Book deleted");
      queryClient.invalidateQueries({ queryKey: ["books-admin"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

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
            <BookPlus /> Admin: Manage Books
          </h1>
          <form
            className="bg-white rounded-md shadow p-6 flex flex-col gap-4 mb-8"
            onSubmit={e => {
              e.preventDefault();
              addBookMutation.mutate({
                title: form.title,
                author: form.author,
                price: parseFloat(form.price),
                image_url: form.image_url || undefined,
                rating: form.rating ? parseFloat(form.rating) : undefined,
              });
            }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                name="title"
                value={form.title}
                placeholder="Title"
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <Input
                name="author"
                value={form.author}
                placeholder="Author"
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
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
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
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
                onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
              />
              <Input
                name="image_url"
                value={form.image_url}
                placeholder="Image URL (optional)"
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              />
            </div>
            <Button type="submit" disabled={addBookMutation.isPending}>Add Book</Button>
          </form>
          <div className="bg-white rounded-md shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Book List</h2>
            {booksQuery.isLoading ? (
              <div>Loading books...</div>
            ) : booksQuery.isError ? (
              <div className="text-destructive">Error loading books.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(booksQuery.data as any[])?.map(book => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>₹{parseFloat(book.price).toFixed(2)}</TableCell>
                      <TableCell>{book.rating ?? "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          title="Delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${book.title}"?`,
                              )
                            ) {
                              deleteBookMutation.mutate(book.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminBooks;
