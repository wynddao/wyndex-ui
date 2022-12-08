import { ChakraProvider, localStorageManager, useColorMode } from "@chakra-ui/react";
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from "react";
import { darkTheme, lightTheme } from "../theme";
import { useLocalStorage } from "react-use";

export enum ThemeModes {
  light = "light",
  dark = "dark",
}

interface IThemeContext {
  theme: ThemeModes | undefined;
  switchTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | null>(null);

const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<ThemeModes>("themeColor");
  const themeConfig = useMemo(() => (theme === ThemeModes.dark ? darkTheme : lightTheme), [theme]);

  const switchTheme = useCallback(() => {
    setTheme(theme === ThemeModes.dark ? ThemeModes.light : ThemeModes.dark);
  }, [setTheme, theme]);

  useEffect(() => {
    const preferSchema = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? ThemeModes.dark
      : ThemeModes.light;

    setTheme(theme || preferSchema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      <ChakraProvider cssVarsRoot="body" theme={themeConfig}>
        <WrapperChackraUI>{children}</WrapperChackraUI>
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("Error theme context");
  }
  return context;
};

export default ThemeProvider;

const WrapperChackraUI: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme();
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(theme);
  }, [theme, setColorMode]);

  return <>{children}</>;
};
