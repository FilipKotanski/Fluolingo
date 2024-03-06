

import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthenticationContext = createContext();

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

   // Check for authentication status on component mount
  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    if (storedIsAuthenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);


  const login = async (formData) => {
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        // Handle unauthorized access
        if (response.status === 401) {
          setErrorMessage('Unauthorized access');
        } else {
          throw new Error('Failed to login');
        }
      } else {
        // Successful authentication, parse response body
        const responseData = await response.json();
        if (responseData.success) {
          setUser(responseData.user); // Set the authenticated user
          setIsAuthenticated(true); // Set authentication status to true
          sessionStorage.setItem("isAuthenticated", "true");
          setErrorMessage(''); // Clear any previous error message
        } else {
          setErrorMessage(responseData.message); // Set error message from response
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Failed to login');
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      const responseData = await response.json();

      if (responseData.success) {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.setItem("isAuthenticated", "false");
        sessionStorage.removeItem("isAuthenticated");
        
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthenticationContext.Provider value={{ user, isAuthenticated, errorMessage, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};