import React, { useState, useEffect } from 'react';
import UserRecipeCard from '../../components/UserRecipeCard';
import api from '../../api';

const UserRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    chefImage: '',
    title: '',
    chefName: '',
    image: '',
    ingredients: '',
    instructions: '',
    url: '',
    moreInfoUrl: '',
    rating: 0,
    prepTime: '',
    servings: 0,
    countryOfOrigin: '',
    dietType: '',
  });

  useEffect(() => {
    fetchRecipes();
    fetchBookmarkedRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/api/recipes/user');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchBookmarkedRecipes = async () => {
    try {
      const response = await api.get('/api/recipes/bookmarked');
      setBookmarkedRecipes(response.data);
    } catch (error) {
      console.error('Error fetching bookmarked recipes:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.name === 'rating' ? parseFloat(e.target.value) : e.target.value;
    setNewRecipe({ ...newRecipe, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedRecipe = {
      ...newRecipe,
      rating: parseFloat(newRecipe.rating) || 0,
    };

    try {
      if (editingRecipe) {
        const response = await api.put(`/api/recipes/${editingRecipe.id}`, submittedRecipe);
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === editingRecipe.id ? response.data : recipe
          )
        );
        setEditingRecipe(null);
      } else {
        const response = await api.post('/api/recipes', submittedRecipe);
        setRecipes((prevRecipes) => [...prevRecipes, response.data]);
      }

      setNewRecipe({
        chefImage: '',
        title: '',
        chefName: '',
        image: '',
        ingredients: '',
        instructions: '',
        url: '',
        moreInfoUrl: '',
        rating: 0,
        prepTime: '',
        servings: 0,
        countryOfOrigin: '',
        dietType: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting recipe:', error);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setNewRecipe(recipe);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/recipes/${id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setShowForm(false);
        setEditingRecipe(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 font-urbanist">
        <h2 className="text-4xl font-extrabold mb-8 text-[#33665A] text-center tracking-wide">Your Culinary Creations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="relative transform transition duration-300 hover:scale-105">
              <UserRecipeCard recipe={recipe} />
              <div className="absolute bottom-4 left-4 flex space-x-3">
                <button
                  onClick={() => handleEdit(recipe)}
                  className="bg-green-900 hover:bg-green-950 text-white font-bold p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-4xl font-extrabold mt-12 mb-8 text-[#33665A] text-center tracking-wide">Bookmarked Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarkedRecipes.map((recipe) => (
            <div key={recipe.id} className="relative transform transition duration-300 hover:scale-105">
              <UserRecipeCard recipe={recipe} />
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setEditingRecipe(null);
            setNewRecipe({
              chefImage: '',
              title: '',
              chefName: '',
              image: '',
              ingredients: '',
              instructions: '',
              url: '',
              moreInfoUrl: '',
              rating: 0,
              prepTime: '',
              servings: 0,
              countryOfOrigin: '',
              dietType: '',
            });
            setShowForm(true);
          }}
          className="fixed bottom-8 right-8 bg-[#33665A] hover:bg-[#264c42] text-white font-bold w-16 h-16 rounded-full focus:outline-none focus:ring-2 focus:ring-[#33665A] focus:ring-opacity-50 flex items-center justify-center group transition-all duration-300 transform hover:scale-110 shadow-lg"
          style={{ position: 'fixed' }}
          title="Add Recipe"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2">
            Add Recipe
          </span>
        </button>
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50" id="my-modal">
            <div className="relative top-20 mx-auto p-8 border w-11/12 md:w-3/4 lg:w-1/2 shadow-2xl rounded-lg bg-white">
              <h2 className="text-3xl font-bold mb-6 text-[#33665A] text-center">
                {editingRecipe ? 'Edit Your Recipe' : 'Create a New Culinary Masterpiece'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { label: 'Recipe Title', name: 'title', type: 'text', placeholder: 'Enter your recipe title' },
                  { label: 'Chef Name', name: 'chefName', type: 'text', placeholder: 'Your name or pseudonym' },
                  { label: 'Recipe Image URL', name: 'image', type: 'url', placeholder: 'https://example.com/your-delicious-dish.jpg' },
                  { label: 'Chef Image URL', name: 'chefImage', type: 'url', placeholder: 'https://example.com/chef-portrait.jpg' },
                  { label: 'Ingredients', name: 'ingredients', type: 'textarea', placeholder: 'List your ingredients, one per line', rows: 4 },
                  { label: 'Cooking Instructions', name: 'instructions', type: 'textarea', placeholder: 'Describe your cooking process step by step', rows: 4 },
                  { label: 'Recipe URL', name: 'url', type: 'url', placeholder: 'https://your-recipe-blog.com/this-recipe' },
                  { label: 'More Info URL', name: 'moreInfoUrl', type: 'url', placeholder: 'https://cooking-tips.com/related-info' },
                  { label: 'Rating', name: 'rating', type: 'number', placeholder: 'Rate your recipe (0-5)', min: 0, max: 5, step: 0.1 },
                  { label: 'Preparation Time', name: 'prepTime', type: 'text', placeholder: 'e.g., 30 minutes, 1 hour' },
                  { label: 'Servings', name: 'servings', type: 'number', placeholder: 'Number of servings', min: 1 },
                  { label: 'Country of Origin', name: 'countryOfOrigin', type: 'text', placeholder: 'Where is this dish from?' },
                  { label: 'Diet Type', name: 'dietType', type: 'text', placeholder: 'e.g., Vegetarian, Vegan, Keto, Paleo' },
                ].map((field) => (
                  <div key={field.name} className="mb-4">
                    <label className="block text-[#33665A] text-sm font-bold mb-2" htmlFor={field.name}>
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="shadow-sm focus:ring-[#33665A] focus:border-[#33665A] block w-full sm:text-sm border-gray-300 rounded-md p-3 transition duration-300 ease-in-out"
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={newRecipe[field.name]}
                        onChange={handleInputChange}
                        required
                        rows={field.rows}
                      />
                    ) : (
                      <input
                        className="shadow-sm focus:ring-[#33665A] focus:border-[#33665A] block w-full sm:text-sm border-gray-300 rounded-md p-3 transition duration-300 ease-in-out"
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        name={field.name}
                        value={newRecipe[field.name]}
                        onChange={handleInputChange}
                        required
                        {...(field.type === 'number' && { min: field.min, max: field.max, step: field.step })}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingRecipe(null);
                    }}
                    className="bg-green-900 hover:bg-green-950 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#33665A] hover:bg-[#264c42] text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#33665A] focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRecipes;
