
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  rating: number | null;
  language: string | null;
  created_at: string;
  updated_at: string;
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
      const response = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (response.then) {
        // Handle the mock client response
        const result = await response.then((callback: any) => callback);
        if (result.error) throw new Error(result.error.message);
        setBooks(result.data || []);
      } else {
        // Handle real Supabase response
        const { data, error } = response;
        if (error) throw error;
        setBooks(data || []);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await supabase
        .from('books')
        .insert([book]);

      if (response.then) {
        // Handle mock client
        const result = await response;
        if (result.error) throw new Error(result.error.message);
        await fetchBooks(); // Refresh the list
        return result.data;
      } else {
        // Handle real Supabase
        const { data, error } = response;
        if (error) throw error;
        await fetchBooks(); // Refresh the list
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const response = await supabase
        .from('books')
        .update(updates);

      if (response.then) {
        // Handle mock client with eq method
        const result = await response.update(updates, { eq: ['id', id] });
        if (result.error) throw new Error(result.error.message);
        await fetchBooks(); // Refresh the list
        return result.data;
      } else {
        // Handle real Supabase
        const { data, error } = await response.eq('id', id).select().single();
        if (error) throw error;
        await fetchBooks(); // Refresh the list
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const response = await supabase
        .from('books')
        .delete();

      if (response.then) {
        // Handle mock client
        const result = await response;
        if (result.error) throw new Error(result.error.message);
        await fetchBooks(); // Refresh the list
      } else {
        // Handle real Supabase
        const { error } = await response.eq('id', id);
        if (error) throw error;
        await fetchBooks(); // Refresh the list
      }
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
