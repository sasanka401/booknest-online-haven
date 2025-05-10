
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, MapPin, Package, Bell } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

const Header = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "New book \"The Midnight Library\" is now available!", time: "2 hours ago", unread: true },
    { id: 2, text: "Your order #12345 has been shipped", time: "1 day ago", unread: true },
    { id: 3, text: "Special offer: 20% off on all fiction books", time: "3 days ago", unread: false }
  ]);

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
          <h1 className="logo">BookNest</h1>
        </Link>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn("px-4 py-2", location.pathname === "/" ? "text-primary font-medium" : "text-gray-600 hover:text-primary")}>
                Home
              </Link>
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
            
            <li><Link to="/login" className="btn-login">Login</Link></li>
            <li><Link to="/signup" className="btn-signup">Sign Up</Link></li>
            
            {/* Mobile menu icon would go here for responsive design */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
