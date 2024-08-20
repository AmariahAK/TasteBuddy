import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api';

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #e8f5e9;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2e7d32;
`;

const LogoutButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2e7d32;
  }
`;

const Section = styled.section`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #4caf50;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
  &:last-child {
    border-bottom: none;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
  &:hover {
    background-color: #d32f2f;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #4caf50;
  font-size: 1.2rem;
`;

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
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <Section>
        <SectionTitle>Statistics</SectionTitle>
        <pre>{JSON.stringify(statistics, null, 2)}</pre>
      </Section>

      <Section>
        <SectionTitle>Users</SectionTitle>
        <List>
          {Array.isArray(users) && users.map(user => (
            <ListItem key={user.id}>{user.email}</ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Recipes</SectionTitle>
        <List>
          {Array.isArray(recipes) && recipes.map(recipe => (
            <ListItem key={recipe.id}>{recipe.title}</ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Comments</SectionTitle>
        <List>
          {Array.isArray(comments) && comments.map(comment => (
            <ListItem key={comment.id}>
              {comment.content}
              <DeleteButton onClick={() => handleDeleteComment(comment.id)}>Delete</DeleteButton>
            </ListItem>
          ))}
        </List>
      </Section>
    </DashboardContainer>
  );
};

export default AdminDashboard;