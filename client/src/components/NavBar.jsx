import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaUser, FaSignInAlt, FaCaretDown } from "react-icons/fa";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileDropdownToggle = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setIsProfileDropdownOpen(false);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <div className="w-full sticky top-0 z-50">
      <nav className="bg-customGreen text-white py-4 font-urbanist">
        <div className="container mx-auto flex justify-between items-center px-4 w-full">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://res.cloudinary.com/dud0jjkln/image/upload/v1723487640/1_fenfqx.jpg"
              alt="TasteTribe Logo"
              className="h-8 mr-2"
            />
            <span className="text-xl font-bold">TasteTribe</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            {[
              { name: "HOME", path: "/" },
              { name: "ABOUT US", path: "/aboutus" },
              { name: "RECIPES", path: "/recipes" },
              { name: "CONTACT US", path: "/contactus" },
            ].map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-gray-400 ${
                    isActive ? "border-b-2 border-red-500" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Icons for larger screens */}
          <div className="hidden md:flex space-x-4 items-center">
            <div className="relative profile-dropdown">
              <button
                onClick={handleProfileDropdownToggle}
                className="flex items-center hover:text-gray-400 focus:outline-none"
              >
                <FaUser size={24} />
                <FaCaretDown size={16} className="ml-1" />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">

                  {isLoggedIn ? (
                    <>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/myrecipes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Recipes
                      </NavLink>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <NavLink
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsLoggedIn(true);
                        localStorage.setItem('token', 'some_token_value');
                      }}
                    >
                      Log In
                    </NavLink>
                  )}
                </div>
              )}
            </div>
            {!isLoggedIn && (
              <NavLink
                to="/signup"
                className="bg-white text-customGreen px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
              >
                Sign Up
              </NavLink>
            )}

          </div>

          {/* Toggle Menu and Search Icon for mobile */}
          <div className="flex space-x-4 md:hidden">
            <button onClick={handleMenuToggle} className="hover:text-gray-400">
              <FaBars size={24} />
            </button>
            <div className="relative profile-dropdown">
              <button
                onClick={handleProfileDropdownToggle}
                className="flex items-center hover:text-gray-400 focus:outline-none"
              >
                <FaUser size={24} />
                <FaCaretDown size={16} className="ml-1" />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">

                  {isLoggedIn ? (
                    <>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/myrecipes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Recipes
                      </NavLink>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <NavLink
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsLoggedIn(true);
                        localStorage.setItem('token', 'some_token_value');
                      }}
                    >
                      Log In
                    </NavLink>
                  )}
                </div>
              )}
            </div>
            {!isLoggedIn && (
              <NavLink
                to="/signup"
                className="bg-white text-customGreen px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition duration-300"
              >
                Sign Up
              </NavLink>
            )}

          </div>

          {/* Dropdown Menu for Mobile */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 w-full bg-customGreen md:hidden">
              {[
                { name: "HOME", path: "/" },
                { name: "ABOUT US", path: "/aboutus" },
                { name: "RECIPES", path: "/recipes" },
                { name: "CONTACT US", path: "/contactus" },
              ].map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `block py-2 px-4 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;