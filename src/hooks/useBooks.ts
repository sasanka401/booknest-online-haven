

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  price: number;
  image_url: string | null;
  stock?: number;
  rating: number | null;
  language: string | null;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      // Convert the data to match our Book interface
      const booksData = data?.map(book => ({
        ...book,
        id: book.id.toString(), // Convert to string for consistency
      })) || [];
      
      setBooks(booksData);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: Omit<Book, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([book])
        .select();

      if (error) throw error;
      await fetchBooks(); // Refresh the list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) throw error;
      await fetchBooks(); // Refresh the list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;
      await fetchBooks(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refreshBooks: fetchBooks,
  };
}

