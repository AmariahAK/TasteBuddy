import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import App from "./App";
import Home from "./pages/Home/Home";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import Recipes from "./pages/Recipes/Recipes";
import RecipeInfo from "./pages/RecipeInfo/RecipeInfo";
import UserRecipes from "./pages/UserRecipes/UserRecipes";
import UserProfile from "./pages/UserProfile/UserProfile";
import LogIn from "./pages/LogIn/LogIn";
import SignUp from "./pages/SignUp/SignUp";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  const isAdmin = isAuthenticated && user?.role === 'admin';
  return isAdmin ? children : <Navigate to="/" replace />;
};

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          {
            path: "/aboutus",
            element: <AboutUs />,
          },
          {
            path: "/contactus",
            element: <ContactUs />,
          },
          {
            path: "/recipes",
            element: <Recipes />,
          },
          {
            path: "/recipes/:recipeId",
            element: <RecipeInfo />,
          },
          {
            path: "/myrecipes",
            element: <UserRecipes />,
          },
          {
            path: "/profile",
            element: <UserProfile />,
          },
        ],
      },
      {
        element: <AdminRoute><Outlet /></AdminRoute>,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },
];

export default routes;
