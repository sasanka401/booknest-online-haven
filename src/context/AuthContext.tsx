
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

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

// Helper function for safe storage cleanup (see supabase-auth-clean-up)
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
  const login = async (email: string, password: string) => {
    setLoading(true);
    cleanupAuthState();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Upsert profile after login
      const userId = data?.user?.id;
      const name =
        data?.user?.user_metadata?.name ||
        data?.user?.user_metadata?.full_name ||
        null;
      if (userId) {
        await supabase.from("profiles").upsert([
          { id: userId, name }
        ]);
      }

      toast.success("Logged in!", { duration: 2000 });
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Signup method with profile record creation
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    cleanupAuthState();
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { name }
        },
      });
      if (error) throw error;

      // Ensure a profile row is created for new users after signup
      const userId = data?.user?.id;
      if (userId) {
        await supabase.from("profiles").upsert([
          { id: userId, name }
        ]);
      }

      toast.success("Signup successful! Please check your inbox.");
    } catch (e: any) {
      toast.error(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      toast("Logged out");
      window.location.href = "/auth";
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
