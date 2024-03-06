// AuthenticationContext.js

import React, { createContext, useContext, useState } from 'react';

const AuthenticationContext = createContext();

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    // Perform login logic, e.g., call an API to authenticate user
    // Upon successful authentication, set user data and isAuthenticated to true
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Perform logout logic, e.g., clear user data and set isAuthenticated to false
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthenticationContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

