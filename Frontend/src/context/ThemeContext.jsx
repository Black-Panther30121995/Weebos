import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    console.log('toggleTheme called, current theme:', theme); // Should log
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      console.log('Theme set to:', newTheme); // Should log
      return newTheme;
    });
  };

  useEffect(() => {
    console.log('ThemeProvider useEffect ran, theme:', theme);
    const handleStorageChange = (e) => {
      const newTheme = e.newValue || localStorage.getItem('theme') || 'light';
      setTheme(newTheme);
      console.log('Storage changed, new theme:', newTheme);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Empty dependency array

  console.log('ThemeProvider rendered, current theme:', theme);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};