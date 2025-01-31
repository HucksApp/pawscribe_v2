import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export const EditorThemeContext = createContext();

export const useEditorThemeProvider = () => useContext(EditorThemeContext);

export const EditorThemeProvider = ({ children }) => {
  const { themeMode } = useTheme();
  const [options, setOptions] = useState({
    theme: `vs-${themeMode}`,
    language: "javascript",
    fontSize: 14,
    fontWeight: "normal",
    fontFamily: "Raleway",
  });

  const handleChangeOptions = (newOptions) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      ...newOptions,
    }));
  };

  useEffect(() => {
    // Sync the editor theme with the app theme
    handleChangeOptions({ theme: `vs-${themeMode}` });
  }, [themeMode]);

  return (
    <EditorThemeContext.Provider value={{ options, handleChangeOptions }}>
      {children}
    </EditorThemeContext.Provider>
  );
};
