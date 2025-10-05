
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types/auth';
import '../styles/Navbar.css';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h2>TaskManager</h2>
          </Link>
        </div>
        
        <div className="navbar-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/tasks-list" 
            className={`nav-link ${isActiveRoute('/tasks-list') ? 'active' : ''}`}
          >
            Tasks
          </Link>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-user">
          <Link to="/profile"><span className="user-greeting">Hello, {user?.name}</span></Link>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;