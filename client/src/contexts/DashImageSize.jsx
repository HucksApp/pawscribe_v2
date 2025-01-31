import React, { createContext, useContext, useState } from "react";

// Create the context
export const DashImageContext = createContext();

// Create a custom hook for easier context usage
export const useDashImageContext = () => useContext(DashImageContext);

// Create the context provider component
export const DashImageProvider = ({ children }) => {
  // Set default image size to 'medium'
  const [dashImageSize, setDashImageSize] = useState(4);

  return (
    <DashImageContext.Provider value={{ dashImageSize, setDashImageSize }}>
      {children}
    </DashImageContext.Provider>
  );
};
