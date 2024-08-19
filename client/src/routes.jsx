import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
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
import AdminSignIn from "./pages/Admin/AdminSignin";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  return isAuthenticated ? children : <Navigate to="/admin/signin" replace />;
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
      // New public routes
      {
        path: "/aboutus",
        element: <AboutUs />,
      },
      {
        path: "/contactus",
        element: <ContactUs />,
      },
      
      // Protected routes
      {
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          {
            path: "/recipes/:recipeId",
            element: <RecipeInfo />,
          },
          {
            path: "/recipes",
            element: <Recipes />,
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
        path: "/admin",
        children: [
          {
            index: true,
            element: <Navigate to="/admin/signin" replace />,
          },
          {
            path: "signin",
            element: <AdminSignIn />,
          },
          {
            element: <AdminRoute><Outlet /></AdminRoute>,
            children: [
              {
                path: "dashboard",
                element: <AdminDashboard />,
              },
            ],
          },
        ],
      },         
    ],
  },
];

export default routes;
