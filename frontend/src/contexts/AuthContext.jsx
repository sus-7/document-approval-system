import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authUrl = import.meta.env.VITE_API_URL + "/user/status";
      const response = await fetch(authUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error.message);
        throw new Error(`${response.message}`);
      }

      const result = await response.json();
      console.log("Auth status:", result);
      setLoggedInUser(result.user);
    } catch (error) {
      console.log("AuthContext service :: checkAuthStatus :: error : ", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loggedInUser,
        setLoggedInUser,
        tempUser,
        setTempUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
