
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const adminSchema = z.object({
  adminId: z.string().refine((val) => val === "admin001", {
    message: "Invalid admin ID",
  }),
  password: z.string().refine((val) => val === "1111", {
    message: "Invalid password",
  }),
});

type AdminLoginForm = {
  adminId: string;
  password: string;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminLoginForm>({
    adminId: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = adminSchema.parse(formData);
      if (validatedData.adminId === "admin001" && validatedData.password === "1111") {
        // Store admin session
        localStorage.setItem("adminSession", "true");
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <Input
                  id="adminId"
                  type="text"
                  value={formData.adminId}
                  onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                  placeholder="Enter admin ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
