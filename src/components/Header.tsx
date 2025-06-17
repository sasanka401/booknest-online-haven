
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingCart, MapPin, Package, Bell, Heart, UserRound, LogOut, BookOpen } from "lucide-react";
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
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: 'New book "The Midnight Library" is now available!', time: "2 hours ago", unread: true },
    { id: 2, text: "Your order #12345 has been shipped", time: "1 day ago", unread: true },
    { id: 3, text: "Special offer: 20% off on all fiction books", time: "3 days ago", unread: false }
  ]);
  const { user, logout } = useAuth();

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
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          GyanVidya
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className={cn("px-4 py-2 flex items-center", location.pathname === "/" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-4 py-2 text-gray-600 hover:text-primary">
                Category
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        to="/"
                      >
                        <BookOpen className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          All Books
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Discover all books across various genres.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="#" title="Fiction">
                    Immerse yourself in captivating stories.
                  </ListItem>
                  <ListItem href="#" title="Non-Fiction">
                    Expand your knowledge with factual reads.
                  </ListItem>
                  <ListItem href="#" title="Children's Books">
                    Engaging stories for young readers.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/resell" className={cn("px-4 py-2 flex items-center", location.pathname === "/resell" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                <BookOpen size={18} className="mr-1" />
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

        <ul className="flex items-center gap-6">
          <li>
            <Link to="/cart" className="flex items-center relative">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </li>

          <li>
            <Link to="/wishlist" className="flex items-center relative">
              <Heart size={24} />
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
        </ul>
      </div>
    </header>
  );
};

// A helper component for the NavigationMenu
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
