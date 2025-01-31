import React, { createContext, useState, useContext, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { customTheme } from '../theme/theme';

// Create Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  // Toggle between light and dark modes
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);  // Save the theme to localStorage
  };

  // Retrieve the theme from localStorage when the component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setThemeMode(savedTheme);  // Set theme from localStorage if available
    }
  }, []);

  // Update the `data-theme` attribute on the `body` element
  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider theme={customTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Custom Hook to use Theme
export const useTheme = () => useContext(ThemeContext);
