import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, AppTheme } from "../styles/Theme";

const ThemeContext = createContext<AppTheme | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // const colorScheme = useColorScheme();
  // const theme? = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme = lightTheme; // Força o tema claro para evitar problemas com SafeAreaView

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}