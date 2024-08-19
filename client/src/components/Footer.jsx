import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-customGreen text-white py-3 font-urbanist w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 w-full">
        {/* Logo */}
        <div className="mb-4 md:mb-0 flex items-center">
          <img src="https://res.cloudinary.com/dud0jjkln/image/upload/v1723487640/1_fenfqx.jpg" alt="TasteTribe Logo" className="h-8 mr-2" />
          <span className="text-xl font-bold">TasteTribe</span>
        </div>

        {/* Navigation Links */}
        <div className="mb-4 md:mb-0">
          <ul className="flex space-x-6">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "text-gray-400" : "hover:text-gray-400"}>HOME</NavLink>
            </li>
            <li>
              <NavLink to="/aboutus" className={({ isActive }) => isActive ? "text-gray-400" : "hover:text-gray-400"}>ABOUT US</NavLink>
            </li>
            <li>
              <NavLink to="/contactus" className={({ isActive }) => isActive ? "text-gray-400" : "hover:text-gray-400"}>CONTACT US</NavLink>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="https://www.tiktok.com/@tastetribe" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-black">
            <FaTiktok size={24} />
          </a>
          <a href="https://www.facebook.com/tastetribe" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-blue-700">
            <FaFacebook size={24} />
          </a>
          <a href="https://www.instagram.com/tastetribe" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-pink-800">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.youtube.com/tastetribe" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-red-600">
            <FaYoutube size={24} />
          </a>
          <a href="https://x.com/tastetribe" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-gray-800">
            <FaXTwitter size={24} />
          </a>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center mt-4">
        <p>©️ 2024 TASTETRIBE</p>
      </div>
    </footer>
  );
};

export default Footer;