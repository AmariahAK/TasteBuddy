import React from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/'].includes(location.pathname);
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && isAuthenticated && <NavBar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
