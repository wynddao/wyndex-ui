"use client";

import { FormLabel, Icon, Switch } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { ThemeModes, useTheme } from "../../providers/ThemeProvider";

export default function ThemeSwitcher() {
  const { switchTheme, theme } = useTheme();

  return (
    <FormLabel
      htmlFor="theme-switcher"
      as={"label"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
      position="relative"
    >
      <Icon
        fontSize={{ base: "md", lg: "lg" }}
        as={FiMoon}
        sx={{ color: theme === ThemeModes.dark && "yellow.400" }}
        transition="all ease-in 0.5s"
      />
      <Switch
        aria-label="auto"
        id="theme-switcher"
        size={{ base: "md", lg: "lg" }}
        isChecked={theme === ThemeModes.dark ? false : true}
        style={{ transition: "all ease-in 1s" }}
        onChange={switchTheme}
      />
      <Icon
        fontSize={{ base: "md", lg: "lg" }}
        as={FiSun}
        sx={{ color: theme === ThemeModes.light && "orange.500" }}
        transition="all ease-in 0.5s"
      />
    </FormLabel>
  );
}
