import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";

const Auth = () => {
  const { login, signup, loading, user } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loginTimer, setLoginTimer] = useState<number | null>(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  // Track previous user value so that the effect is only triggered on login
  const [prevUser, setPrevUser] = useState(user);

  useEffect(() => {
    // When login happened (user became non-null)
    if (user && !prevUser && typeof loginTimer === "number") {
      setLoginTimer(null);
    }
    setPrevUser(user);
    if (user) {
      if (isAdminLogin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, loginTimer, navigate, prevUser, isAdminLogin]);

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
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user">User Login</TabsTrigger>
              <TabsTrigger value="admin" onClick={() => setIsAdminLogin(true)}>
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user">
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
              
              <button
                onClick={() => setIsSignup((s) => !s)}
                className="text-primary hover:underline text-sm mt-4 block w-full text-center"
              >
                {isSignup
                  ? "Already have an account? Log in"
                  : "New here? Create an account"}
              </button>
            </TabsContent>

            <TabsContent value="admin">
              <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
                <Shield className="w-6 h-6 mr-2" />
                Admin Login
              </h1>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-1 font-medium">Admin Email</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="admin@booknest.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Admin Password</label>
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
                  {loading ? "Loading..." : "Admin Login"}
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Only authorized administrators can access this section
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
