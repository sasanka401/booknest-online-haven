import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const { login, signup, loading, user } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loginTimer, setLoginTimer] = useState<number | null>(null);
  const navigate = useNavigate();

  // Track previous user value so that the effect is only triggered on login
  const [prevUser, setPrevUser] = useState(user);

  useEffect(() => {
    // When login happened (user became non-null)
    if (user && !prevUser && typeof loginTimer === "number") {
      const duration = (performance.now() - loginTimer) / 1000;
      if (duration <= 2) {
        toast.success(`Login time: ${duration.toFixed(2)}s (under 2 seconds 🚀)`);
      } else {
        toast.warning(`Login time: ${duration.toFixed(2)}s (over 2 seconds)`);
      }
      setLoginTimer(null);
    }
    setPrevUser(user);
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, loginTimer, navigate, prevUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      signup(form.name, form.email, form.password);
    } else {
      setLoginTimer(performance.now());
      login(form.email, form.password);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex justify-center items-center">
        <div className="max-w-sm w-full mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isSignup ? "Sign Up" : "Login"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="jane@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Loading..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </Button>
          </form>
          <div className="mt-5 text-center">
            <button
              onClick={() => setIsSignup((s) => !s)}
              className="text-primary hover:underline text-sm"
            >
              {isSignup
                ? "Already have an account? Log in"
                : "New here? Create an account"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
