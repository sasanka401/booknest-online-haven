
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

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
        <nav>
          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
            <li>
              <Link to="/cart" className={location.pathname === "/cart" ? "active" : "relative"}>
                <div className="flex items-center">
                  <ShoppingCart className="mr-1" size={18} />
                  <span>Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-3 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>
            </li>
            <li className="notification-container">
              <button 
                className="notification-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
              >
                <span className="notification-icon">🔔</span>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      >
                        <div className="notification-content">
                          <p className="notification-text">{notification.text}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <a href="#" className="view-all">
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </li>
            <li><Link to="/login" className="btn-login">Login</Link></li>
            <li><Link to="/signup" className="btn-signup">Sign Up</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
