import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <div className="navbar">
        <h1>Job Portal</h1>
        <nav>
          <Link to="/jobs">Jobs</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user.role === 'user' && <Link to="/profile">Profile</Link>}
              {user.role === 'recruiter' && <Link to="/post-job">Post Job</Link>}
              <button onClick={handleLogoutClick} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="btn-group">
              <button onClick={confirmLogout} className="btn btn-danger">
                Yes, Logout
              </button>
              <button onClick={() => setShowLogoutModal(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
