import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

// Define theme colors
export const Colors = {
  modern: {
    light: {
      darkBackground: "#f0f2f5",
      background: "#ffffff",
      card: "#f8f9fa",
      text: "#212529",
      hint: "#6c757d",
      border: "#dee2e6",
      accent: "#0d6efd",
      userAccent: "#cfe2ff",
      success: "#198754",
      error: "#dc3545",
      warning: "#ffc107",
    },
    dark: {
      darkBackground: "#121212",
      background: "#1e1e1e",
      card: "#2c2c2c",
      text: "#f8f9fa",
      hint: "#adb5bd",
      border: "#343a40",
      accent: "#0d6efd",
      userAccent: "#495057",
      success: "#28a745",
      error: "#ff6b6b",
      warning: "#ffd43b",
    },
  },
  normal: {
    light: {
      darkBackground: "#dbdbdb",
      background: "#FFFFFF",
      card: "#F5F5F5",
      text: "#000000",
      hint: "#666666",
      border: "#E0E0E0",
      accent: "#466db3",
      userAccent: "#dce3fc",
      success: "#08823b",
      error: "#c41414",
      warning: "#fab71b",
    },
    dark: {
      darkBackground: "#25272e",
      background: "#2d3039",
      card: "#353b46",
      text: "#FFFFFF",
      hint: "#8a8a8a",
      border: "#4A4A4A",
      accent: "#466db3",
      userAccent: "#6767f5",
      success: "#08823b",
      error: "#c41414",
      warning: "#fab71b",
    },
  },
  elegant: {
    light: {
      darkBackground: "#fdfaf6",
      background: "#ffffff",
      card: "#f8f5f0",
      text: "#3c2f2f",
      hint: "#7d5a50",
      border: "#e6d5b8",
      accent: "#b08d57", // золотистый
      userAccent: "#c9a66b",
      success: "#2e7d32",
      error: "#c62828",
      warning: "#ed6c02",
    },
    dark: {
      darkBackground: "#1b1b1b",
      background: "#262626",
      card: "#333333",
      text: "#f5f5dc",
      hint: "#d4af37",
      border: "#8b7355",
      accent: "#d4af37",
      userAccent: "#b8860b",
      success: "#4caf50",
      error: "#f44336",
      warning: "#ff9800",
    },
  },
};

type ThemeContextType = {
  isDarkMode: boolean;
  currentStyle: "modern" | "normal" | "elegant";
  toggleTheme: () => void;
  setStyle: (style: "modern" | "normal" | "elegant") => void;
  colors:
    | typeof Colors.modern.light
    | typeof Colors.modern.dark
    | typeof Colors.normal.light
    | typeof Colors.normal.dark
    | typeof Colors.elegant.light
    | typeof Colors.elegant.dark;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [currentStyle, setCurrentStyle] = useState<"modern" | "normal" | "elegant">("normal");

  // Update theme if system theme changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === "dark");
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const setStyle = (style: "modern" | "normal" | "elegant") => {
    setCurrentStyle(style);
  };

  const colors = Colors[currentStyle][isDarkMode ? "dark" : "light"];

  return <ThemeContext.Provider value={{ isDarkMode, currentStyle, toggleTheme, setStyle, colors }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
