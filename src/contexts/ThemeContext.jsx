import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children, defaultTheme = "light" }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("preschool-theme");
    if (savedTheme && ["light", "dark", "playful"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Update document attributes when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("preschool-theme", theme);
  }, [theme]);

  // Change theme with smooth transition
  const changeTheme = (newTheme) => {
    if (newTheme === theme) return;

    setIsTransitioning(true);

    // Add transition class
    document.documentElement.classList.add("theme-transitioning");

    setTimeout(() => {
      setTheme(newTheme);

      setTimeout(() => {
        setIsTransitioning(false);
        document.documentElement.classList.remove("theme-transitioning");
      }, 250);
    }, 50);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    changeTheme(newTheme);
  };

  // Cycle through all themes
  const cycleTheme = () => {
    const themes = ["light", "dark", "playful"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex]);
  };

  // Get theme colors based on current theme
  const getThemeColors = () => {
    const colorMappings = {
      light: {
        primary: "#3b82f6",
        secondary: "#f97316",
        accent: "#a855f7",
        background: "#ffffff",
        surface: "#fafaf9",
        text: "#1c1917",
        textSecondary: "#44403c",
        border: "#e7e5e4",
      },
      dark: {
        primary: "#dbeafe",
        secondary: "#fed7aa",
        accent: "#e9d5ff",
        background: "#1c1917",
        surface: "#292524",
        text: "#ffffff",
        textSecondary: "#d6d3d1",
        border: "#44403c",
      },
      playful: {
        primary: "#f59e0b",
        secondary: "#ec4899",
        accent: "#a855f7",
        background: "#e0f2fe",
        surface: "#ffffff",
        text: "#1c1917",
        textSecondary: "#44403c",
        border: "#e7e5e4",
      },
    };

    return colorMappings[theme] || colorMappings.light;
  };

  // Check if theme is dark
  const isDark = theme === "dark";

  // Check if theme is playful
  const isPlayful = theme === "playful";

  const value = {
    theme,
    setTheme: changeTheme,
    toggleTheme,
    cycleTheme,
    isTransitioning,
    getThemeColors,
    isDark,
    isPlayful,
    availableThemes: ["light", "dark", "playful"],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.oneOf(["light", "dark", "playful"]),
};

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Higher-order component for theme-aware components
export const withTheme = (Component) => {
  const ThemedComponent = (props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };

  ThemedComponent.displayName = `withTheme(${
    Component.displayName || Component.name
  })`;
  return ThemedComponent;
};

// Export ThemeContext as named export for consistency
export { ThemeContext };
