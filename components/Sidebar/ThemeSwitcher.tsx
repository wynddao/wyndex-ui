"use client";

import { Flex, Icon, Switch, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { handleChangeColorModeValue } from "../../utils/theme";

export default function ThemeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex alignItems="center" justifyContent="center" gap={4} m={{ base: "4", lg: "8" }}>
      <Icon
        fontSize={{ base: "md", lg: "lg" }}
        as={FiMoon}
        sx={{ color: handleChangeColorModeValue(colorMode, "inherit", "yellow.400") }}
      />
      <Switch
        isChecked={colorMode === "light"}
        onChange={() => toggleColorMode()}
        size={{ base: "md", lg: "lg" }}
      />
      <Icon
        fontSize={{ base: "md", lg: "lg" }}
        as={FiSun}
        sx={{ color: handleChangeColorModeValue(colorMode, "orange.500", "inherit") }}
      />
    </Flex>
  );
}
