<<<<<<< HEAD
import React, { createContext, useContext, useState, ReactNode } from "react";
// import { supabase } from "@/integrations/supabase/client"; // Removed Supabase import
// import type { User, Session } from "@supabase/supabase-js"; // Removed Supabase types
=======

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
>>>>>>> 14f5a028cbd60355ba989eace090162278e0e7ef
import { toast } from "sonner";

// Mock User and Session types for in-memory authentication
interface User {
  id: string;
  email: string;
  user_metadata: { name?: string; full_name?: string };
}

interface Session {
  user: User;
  // Add other necessary session properties if your UI depends on them
}

// Auth context types
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper function for safe storage cleanup (no longer needed for Supabase)
const cleanupAuthState = () => {
  localStorage.removeItem("mockUser");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user and session from mock localStorage or null
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("mockUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [session, setSession] = useState<Session | null>(null);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false); // Set to false initially as there's no async check on load

  // Mock login method
=======
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status whenever user changes
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    
    let stopped = false;
    console.log("AuthContext: Checking admin status for user:", user?.id, user?.email);
    
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.log("AuthContext: Error fetching user_roles:", error);
          if (!stopped) setIsAdmin(false);
        } else {
          console.log("AuthContext: user_roles data for this user:", data);
          if (!stopped) {
            const adminStatus = data?.role === "admin";
            setIsAdmin(adminStatus);
            
            // If user is admin and just logged in, redirect to admin dashboard
            if (adminStatus && window.location.pathname === "/") {
              console.log("AuthContext: Redirecting admin to dashboard");
              window.location.href = "/admin/dashboard";
            }
          }
        }
      });
      
    return () => {
      stopped = true;
    };
  }, [user]);

  useEffect(() => {
    // Listen to auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthContext: Auth state change:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login method (updated: upsert profile after login)
>>>>>>> 14f5a028cbd60355ba989eace090162278e0e7ef
  const login = async (email: string, password: string) => {
    setLoading(true);
    cleanupAuthState();
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simple mock authentication logic
      if (email === "test@example.com" && password === "password123") {
        const mockUser: User = {
          id: "mock-user-id-123",
          email: email,
          user_metadata: { name: "Test User" },
        };
        const mockSession: Session = { user: mockUser };
        setUser(mockUser);
        setSession(mockSession);
        localStorage.setItem("mockUser", JSON.stringify(mockUser));
        toast.success("Logged in successfully!");
      } else if (email === "admin@booknest.com" && password === "adminpass") {
        // Mock admin user
        const mockAdmin: User = {
          id: "mock-admin-id-456",
          email: email,
          user_metadata: { name: "Admin" },
        };
        const mockAdminSession: Session = { user: mockAdmin };
        setUser(mockAdmin);
        setSession(mockAdminSession);
        localStorage.setItem("mockUser", JSON.stringify(mockAdmin));
        toast.success("Logged in as admin!");
      } 
      else {
        throw new Error("Invalid credentials.");
      }
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Mock signup method
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    cleanupAuthState();
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simple mock signup logic
      if (email && password && name) {
        const newMockUser: User = {
          id: `mock-user-${Date.now()}`,
          email: email,
          user_metadata: { name: name },
        };
        const newMockSession: Session = { user: newMockUser };
        setUser(newMockUser);
        setSession(newMockSession);
        localStorage.setItem("mockUser", JSON.stringify(newMockUser));
        toast.success("Account created successfully!");
      } else {
        throw new Error("Please fill all fields.");
      }
    } catch (e: any) {
      toast.error(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Mock logout
  const logout = async () => {
    setLoading(true);
    cleanupAuthState();
    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      toast("Logged out");
      // No actual redirect needed if Auth handles navigation
    } catch (e: any) {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
