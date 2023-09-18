import React, { createContext, useContext, useEffect, useState } from 'react';
import {Theme} from "../types/ThemeTypes"

type ThemeContextProps = {
    theme: Theme;
    toggleTheme: () => void;
  }
// Create a new context
const ThemeContext = createContext({} as ThemeContextProps);

// Create a custom hook to access the context
export function useTheme() {
  return useContext(ThemeContext);
}

// Create a context provider component
export function ThemeProvider({ children }: {children: React.ReactNode}) {
  // Initialize the theme state with a default value (e.g., 'light')
  const [theme, setTheme] = useState<Theme>('light');

  // Function to toggle the theme
  const toggleTheme = () => {
    // Toggle between 'light' and 'dark'
    
    const body = document.body;
    body.classList.toggle('dark');
    
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem("theme", newTheme)
      return newTheme;
    });
    setTheme
  };

  useEffect(() => {
    const themeStored = localStorage.getItem("theme")

    if(themeStored){
      setTheme(themeStored as Theme)
      if(themeStored === "dark"){
        const body = document.body;
        body.classList.toggle('dark');
      }
    }
  }, []);

  // Provide the theme and toggleTheme function to the context
  const contextValue = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}