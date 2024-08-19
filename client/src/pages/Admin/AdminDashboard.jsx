import React, { useState, useEffect } from 'react';
//import api from '../../api'
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    // Fetch token from localStorage or your preferred storage method
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      fetchData(storedToken);
    }
  }, []);

  const fetchData = async (token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const [usersResponse, recipesResponse, statsResponse] = await Promise.all([
        axios.get('/admin/users', config),
        axios.get('/admin/recipes', config),
        axios.get('/admin/statistics', config)
      ]);

      setUsers(usersResponse.data);
      setRecipes(recipesResponse.data);
      setStatistics(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      const response = await axios.post('/admin/signin', { email, password });
      const newToken = response.data.access_token;
      setToken(newToken);
      localStorage.setItem('adminToken', newToken);
      fetchData(newToken);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/admin/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh comments after deletion
      const commentsResponse = await axios.get('/admin/comments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update state with new comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Render your dashboard components here using the state variables
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Add components to display users, recipes, statistics, etc. */}
      {/* Add forms for signing in, creating recipes, etc. */}
    </div>
  );
};

export default AdminDashboard;
