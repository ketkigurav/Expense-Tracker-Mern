import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token
    setIsLoggedIn(false); // Update the state in App.jsx
    toast.success('Logged out successfully!');
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Expense Dashboard</Link>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            {/* Links shown only when logged in */}
            <Link to="/">Dashboard</Link>
            <Link to="/history">Full History</Link>
            <Link to="/reports">Reports</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            {/* Links shown only when logged out */}
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;