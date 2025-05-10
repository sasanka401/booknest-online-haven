
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer mt-auto">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About BookNest</h3>
            <p>Your one-stop destination for all your reading needs. Discover millions of books across various genres.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: talukdarsasanka348@gmail.com</p>
            <p>Phone: +91 9957672629</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BookNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
