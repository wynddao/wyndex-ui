import { extendTheme } from "@chakra-ui/react";
import { darkColors, lightColors } from "./colors";
import { typography } from "./typography";
import { breakpoints } from "./breakpoints";
import { styles } from "./global";
import { components } from "./components";

export const baseTheme = extendTheme({ breakpoints, styles, ...typography, components });
export const lightTheme = extendTheme({ ...baseTheme, colors: lightColors });
export const darkTheme = extendTheme({ ...baseTheme, colors: darkColors });
