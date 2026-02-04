
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isTheme, setTheme] = useState(() => {
    return sessionStorage.getItem("referralTheme") === "dark";
  });

  useEffect(() => {
    sessionStorage.setItem("referralTheme", isTheme ? "dark" : "light");
  }, [isTheme]);

  // Optional: listen to other tabs
  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "referralTheme") {
        setTheme(event.newValue === "dark");
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = () => setTheme((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
