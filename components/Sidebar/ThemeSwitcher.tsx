"use client";

import { Flex, Icon, Switch, useColorMode } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { ThemeModes, useTheme } from "../../providers/ThemeProvider";

export default function ThemeSwitcher() {
  const { switchTheme, theme } = useTheme();

  return (
    <Flex alignItems="center" justifyContent="center" gap={4} m={{ base: "4", lg: "8" }}>
      <Icon fontSize={{ base: "md", lg: "lg" }} as={FiMoon} sx={{ color: "yellow.400" }} />
      <Switch aria-label="auto" onChange={switchTheme} size={{ base: "md", lg: "lg" }} />
      <Icon fontSize={{ base: "md", lg: "lg" }} as={FiSun} sx={{ color: "orange.500" }} />
    </Flex>
  );
}
