import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../api';

import { FaXTwitter } from "react-icons/fa6";
import {
  FaSearch,
  FaBookmark,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

const dietType = [
  "All",
  "Vegan",
  "Dash",
  "Keto",
  "Atkins",
  "Pescatarian",
  "Gluten-Free",
];

const ExploreRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedDietType, setSelectedDietType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/recipes');
        setRecipes(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        if (error.response && error.response.status === 422) {
          setError("Unauthorized. Please log in.");
          navigate('/login');
        } else {
          setError("An error occurred while fetching recipes.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [navigate]);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (recipe.dietType === selectedDietType || selectedDietType === "All") &&
      (recipe.countryOfOrigin === selectedCountry ||
        selectedCountry === "All") &&
      (recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.chefName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const countries = [
    "All",
    ...new Set(recipes.map((recipe) => recipe.countryOfOrigin)),
  ];

  const shareOnSocialMedia = (platform, recipe) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this ${recipe.title} recipe!`);
    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "instagram":
        shareUrl = `https://instagram.com/pin/create/button/?url=${url}&description=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  const toggleBookmark = async (recipeId) => {
    try {
      if (bookmarkedRecipes.includes(recipeId)) {
        await api.delete(`/api/bookmarks/${recipeId}`);
        setBookmarkedRecipes(bookmarkedRecipes.filter(id => id !== recipeId));
      } else {
        await api.post('/api/bookmarks', { recipeId });
        setBookmarkedRecipes([...bookmarkedRecipes, recipeId]);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-green-50 min-h-screen p-8 font-urbanist">
      <h1 className="text-4xl font-bold text-center mb-12 text-black">
        Explore Recipes
      </h1>

      <div className="flex justify-center space-x-4 mb-12">
        {dietType.map((type) => (
          <button
            key={type}
            className={`px-6 py-3 ${
              selectedDietType === type
                ? "bg-green-600 text-white"
                : "bg-white text-green-600"
            } rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
            onClick={() => setSelectedDietType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search recipes or chefs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 pl-12 pr-10 text-green-600 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600" />
        </div>
        <div className="flex items-center">
          <label
            htmlFor="country-select"
            className="mr-4 text-green-600 font-semibold text-lg"
          >
            Select Country:
          </label>
          <select
            id="country-select"
            className="px-6 py-3 bg-white text-green-600 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="transform transition duration-300 hover:scale-105 bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="relative h-64">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg">
                {recipe.dietType}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold text-green-800">
                  {recipe.title}
                </h3>
                <FaBookmark
                  className={`text-2xl cursor-pointer ${
                    bookmarkedRecipes.includes(recipe.id)
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => toggleBookmark(recipe.id)}
                />
              </div>
              <div className="flex items-center mb-4">
                <img
                  src={recipe.chefImage}
                  alt={recipe.chefName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-gray-600">{recipe.chefName}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Prep Time: {recipe.prepTime}</span>
                <span>Servings: {recipe.servings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-500">★ {recipe.rating}</span>
                <span className="text-green-600">{recipe.countryOfOrigin}</span>
              </div>
              <Link
                to={`/recipes/${recipe.id}`}
                className="mt-4 block w-full text-center bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                View Recipe
              </Link>

              <div className="mt-4 flex justify-end space-x-4">
                <FaFacebook
                  className="text-blue-600 cursor-pointer text-2xl hover:text-blue-800 transition-colors duration-300"
                  onClick={() => shareOnSocialMedia("facebook", recipe)}
                />
                <FaXTwitter
                  className="text-black cursor-pointer text-2xl hover:text-blue-600 transition-colors duration-300"
                  onClick={() => shareOnSocialMedia("twitter", recipe)}
                />
                <FaInstagram
                  className="text-pink-800 cursor-pointer text-2xl hover:text-pink-900 transition-colors duration-300"
                  onClick={() => shareOnSocialMedia("instagram", recipe)}
                />
                <FaWhatsapp
                  className="text-green-500 cursor-pointer text-2xl hover:text-green-700 transition-colors duration-300"
                  onClick={() => shareOnSocialMedia("whatsapp", recipe)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreRecipes;