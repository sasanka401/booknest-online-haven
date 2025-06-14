import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingCart, MapPin, Package, Bell, Heart, UserRound, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

const Header = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: 'New book "The Midnight Library" is now available!', time: "2 hours ago", unread: true },
    { id: 2, text: "Your order #12345 has been shipped", time: "1 day ago", unread: true },
    { id: 3, text: "Special offer: 20% off on all fiction books", time: "3 days ago", unread: false }
  ]);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let stopped = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!stopped) setIsAdmin(data?.role === "admin");
      });
    return () => {
      stopped = true;
    };
  }, [user]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      unread: false
    }));

    setNotifications(updatedNotifications);
    setUnreadCount(0);
    setShowNotifications(false);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link to="/" className="no-underline">
          <h1 className="logo">GyanVidya</h1>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn("px-4 py-2", location.pathname === "/" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                Home
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-4 py-2">Category</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="bg-white rounded-md shadow-lg p-2 min-w-[200px]">
                  <ul className="space-y-1">
                    <li><Link to="/category/romance" className="block px-4 py-2 hover:bg-gray-100 rounded">Romance</Link></li>
                    <li><Link to="/category/fantasy" className="block px-4 py-2 hover:bg-gray-100 rounded">Fantasy</Link></li>
                    <li><Link to="/category/science-fiction" className="block px-4 py-2 hover:bg-gray-100 rounded">Science Fiction</Link></li>
                    <li><Link to="/category/paranormal" className="block px-4 py-2 hover:bg-gray-100 rounded">Paranormal</Link></li>
                    <li><Link to="/category/mystery" className="block px-4 py-2 hover:bg-gray-100 rounded">Mystery</Link></li>
                    <li><Link to="/category/horror" className="block px-4 py-2 hover:bg-gray-100 rounded">Horror</Link></li>
                    <li><Link to="/category/thriller-suspense" className="block px-4 py-2 hover:bg-gray-100 rounded">Thriller/Suspense</Link></li>
                    <li><Link to="/category/action-adventure" className="block px-4 py-2 hover:bg-gray-100 rounded">Action Adventure</Link></li>
                    <li><Link to="/category/historical-fiction" className="block px-4 py-2 hover:bg-gray-100 rounded">Historical Fiction</Link></li>
                    <li><Link to="/category/contemporary-fiction" className="block px-4 py-2 hover:bg-gray-100 rounded">Contemporary Fiction</Link></li>
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/resell" className={cn("px-4 py-2 flex items-center", location.pathname === "/resell" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                <Package size={18} className="mr-1" />
                Resell Books
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/nearby-bookstores" className={cn("px-4 py-2 flex items-center", location.pathname === "/nearby-bookstores" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                <MapPin size={18} className="mr-1" />
                Nearby Stores
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link 
                to="/order-history" 
                className={cn(
                  "px-4 py-2 flex items-center",
                  location.pathname === "/order-history" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
                )}
              >
                <Package size={18} className="mr-1" />
                Order History
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <nav>
          <ul className="nav-links">
            <li className="hidden md:block">
              <Link to="/cart" className={cn("relative flex items-center", location.pathname === "/cart" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                <ShoppingCart className="mr-1" size={18} />
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </li>

            <li className="hidden md:block">
              <Link to="/wishlist" className={cn("relative flex items-center ml-4", location.pathname === "/wishlist" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                <Heart className="mr-1" size={18} />
                <span>Wishlist</span>
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
            </li>

            <li className="notification-container relative">
              <button 
                className="notification-btn flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
              >
                <Bell size={18} className="mr-1" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown absolute right-0 top-10 bg-white rounded-md shadow-lg border border-gray-200 w-80 z-50">
                  <div className="notification-header flex justify-between items-center p-3 border-b">
                    <h3 className="font-medium">Notifications</h3>
                    <button 
                      className="text-sm text-primary hover:text-primary/80"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="notification-list max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b last:border-b-0 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{notification.text}</p>
                          {notification.unread && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full mt-1"></span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="notification-footer p-2 text-center border-t">
                    <a href="#" className="text-sm text-primary hover:text-primary/80">
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </li>

            {/* If the user is logged in, show account icon with dropdown */}
            {user ? (
              <li className="relative flex items-center ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors p-2 group focus:outline-none"
                      title="Account"
                    >
                      <UserRound size={24} className="text-primary group-hover:text-primary/80" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 mt-2" align="end">
                    <DropdownMenuLabel className="flex flex-col pb-1 mb-1 border-b border-muted">
                      <span className="font-bold text-base">
                        {user.user_metadata?.name || "User"}
                      </span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <UserRound size={16} /> Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 text-red-500 cursor-pointer"
                    >
                      <LogOut size={16} /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : (
              <>
                <li><Link to="/login" className="btn-login">Login</Link></li>
                <li><Link to="/signup" className="btn-signup">Sign Up</Link></li>
              </>
            )}

            {/* Admin-only link; hidden if not admin */}
            {user && (
              <li className="ml-4">
                <AdminLink />
              </li>
            )}

            {/* Mobile menu icon would go here for responsive design */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

/** Show Admin link if user is admin */
function AdminLink() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    let stopped = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!stopped) setIsAdmin(data?.role === "admin");
        setLoading(false);
      });
    return () => {
      stopped = true;
    };
  }, [user]);
  if (loading || !isAdmin) return null;
  return (
    <Link
      to="/admin/dashboard"
      className="px-4 py-2 text-primary hover:underline rounded bg-primary/10"
    >
      Admin
    </Link>
  );
}
