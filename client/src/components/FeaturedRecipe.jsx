import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeaturedRecipesCard from '../components/FeaturedRecipesCard';
import api from '../api';

// Define the API endpoint for fetching dessert recipes
//const API_URL = 'http://127.0.0.1:5000/recipes?dietType=Dessert';

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(recipes.length / 2));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [recipes]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 min-h-screen p-8 font-urbanist">
      <h1 className="text-4xl font-bold text-center mb-12 text-green-800 tracking-wide">Featured Recipes</h1>

      <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(recipes.length / 2) }, (_, i) => i * 2).map((startIndex) => (
            <div key={startIndex} className="w-full flex-shrink-0 flex">
              {recipes.slice(startIndex, startIndex + 2).map((recipe) => (
                <div key={recipe.id} className="w-1/2 px-2">
                  <Link to={`/recipes/${recipe.id}`} className="block w-full h-full">
                    <FeaturedRecipesCard recipe={recipe} />
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(recipes.length / 2) }, (_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-green-600' : 'bg-green-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedRecipes;
