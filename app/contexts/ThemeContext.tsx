import React, { createContext, useContext, useState, ReactNode } from 'react';

const lightTheme = {
  mode: 'light',
  background: '#FFFFFF', // main background
  card: '#FFF6ED', // card or input background
  text: '#1A1D1A', // main text
  accent: '#FF6600', // orange accent
  border: '#FF6600',
  input: '#FFF6ED',
  tabActive: '#FF6600', // selected tab icon
  tabInactive: '#B8BCC8',
  unread: '#FF6600', // unread badge
  notification: '#FF6600',
};

const darkTheme = {
  mode: 'dark',
  background: '#000000', // main background
  card: '#1A1D1A', // card or input background
  text: '#FFFFFF', // main text
  accent: '#FF6600', // orange accent
  border: '#FF6600',
  input: '#1A1D1A',
  tabActive: '#FF6600', // selected tab icon
  tabInactive: '#8B8D97',
  unread: '#FF6600', // unread badge
  notification: '#FF6600',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme);
  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === 'light' ? darkTheme : lightTheme));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 