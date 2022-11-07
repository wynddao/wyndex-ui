import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { components } from "./components";
import { typography } from "./typography";

export const extendedTheme = extendTheme({ colors, components, ...typography });
