import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state for auth operations

  const navigate = useNavigate();

  // Load user data from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false); // Mark loading as complete
    };

    loadUser();
  }, []);

  // Handle user login
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
    localStorage.setItem("token", token); // Store token
    setUser(userData); // Update user state
    navigate("/"); // Redirect to dashboard
  };

  // Handle user logout
  const logout = () => {
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("token"); // Remove token
    setUser(null); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
