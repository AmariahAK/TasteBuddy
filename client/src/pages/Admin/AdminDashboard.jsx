import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/signin');
      return;
    }

    try {
      const [usersResponse, recipesResponse, commentsResponse, statsResponse] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/recipes'),
        api.get('/api/admin/comments'),
        api.get('/api/admin/statistics')
      ]);

      setUsers(usersResponse.data);
      setRecipes(recipesResponse.data);
      setComments(commentsResponse.data);
      setStatistics(statsResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/signin');
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/admin/comments/${commentId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-backgroundGreen">
        <div className="text-2xl font-semibold text-customGreen">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundGreen font-urbanist">
      <header className="bg-customGreen text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-customGreen px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-customGreen">Statistics</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(statistics, null, 2)}
          </pre>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-customGreen">Users</h2>
            <ul className="space-y-2">
              {Array.isArray(users) && users.map(user => (
                <li key={user.id} className="bg-gray-100 p-2 rounded-md">{user.email}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-customGreen">Recipes</h2>
            <ul className="space-y-2">
              {Array.isArray(recipes) && recipes.map(recipe => (
                <li key={recipe.id} className="bg-gray-100 p-2 rounded-md">{recipe.title}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-customGreen">Comments</h2>
            <ul className="space-y-2">
              {Array.isArray(comments) && comments.map(comment => (
                <li key={comment.id} className="bg-gray-100 p-2 rounded-md flex justify-between items-center">
                  <span>{comment.content}</span>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
