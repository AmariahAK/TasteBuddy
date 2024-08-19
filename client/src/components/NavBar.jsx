import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaUser, FaCaretDown } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import api from '../api';


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileDropdownToggle = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await api.post('/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  const navItems = [
    //{ name: "HOME", path: "/", requireAuth: false },
    { name: "RECIPES", path: "/recipes", requireAuth: true },
    { name: "MY RECIPES", path: "/myrecipes", requireAuth: true },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-customGreen text-white py-4 font-urbanist sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img src="https://res.cloudinary.com/dud0jjkln/image/upload/v1723487640/1_fenfqx.jpg" alt="TasteTribe Logo" className="h-8 mr-2" />
          <span className="text-xl font-bold">TasteTribe</span>
        </NavLink>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {isAuthenticated && (
            <>
              <NavLink to="/recipes" className={({ isActive }) => `hover:text-gray-400 ${isActive ? "border-b-2 border-red-500" : ""}`}>
                RECIPES
              </NavLink>
              <NavLink to="/myrecipes" className={({ isActive }) => `hover:text-gray-400 ${isActive ? "border-b-2 border-red-500" : ""}`}>
                MY RECIPES
              </NavLink>
            </>
          )}
        </div>

        {/* Auth Buttons / Profile Dropdown */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={handleProfileDropdownToggle} className="flex items-center hover:text-gray-400 focus:outline-none">
                <FaUser size={24} />
                <FaCaretDown size={16} className="ml-1" />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileDropdownOpen(false)}>
                    My Profile
                  </NavLink>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-gray-400">Log In</NavLink>
              <NavLink to="/signup" className="bg-white text-customGreen px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300">Sign Up</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={handleMenuToggle}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          {isAuthenticated ? (
            <>
              <NavLink to="/recipes" className="block py-2 px-4 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                RECIPES
              </NavLink>
              <NavLink to="/myrecipes" className="block py-2 px-4 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>
                MY RECIPES
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="block py-2 px-4 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Log In</NavLink>
              <NavLink to="/signup" className="block py-2 px-4 hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Sign Up</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
