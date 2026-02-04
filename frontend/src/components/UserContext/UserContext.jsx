import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null, // Initially null
  });

  // On app load, try to rehydrate user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
        console.log( storedUser); // Check what's in localStorage
    if (storedUser) {
      // console.log("are you here")
      setAuthState({ user: JSON.parse(storedUser) });    }
  }, []);

  //Update auth state and persist to localStorage
  const login = (user) => {
    // console.log("hello localstorage")
    localStorage.setItem("userDetails", JSON.stringify(user));
    setAuthState({ user });
  };

  // ✅ Clear auth state and localStorage
  const logout = () => {
    localStorage.removeItem("userDetails");
    console.log("remove from localstorage");
    setAuthState({ user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
