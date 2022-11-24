import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { components } from "./components";
import { typography } from "./typography";
import { breakpoints } from "./breakpoints";
export const extendedTheme = extendTheme({ breakpoints, colors, components, ...typography });
