import { extendTheme } from "@chakra-ui/react";
import { darkColors, lightColors } from "./colors";
import { typography } from "./typography";
import { breakpoints } from "./breakpoints";
import { styles } from "./global";

export const baseTheme = extendTheme({ breakpoints, styles, ...typography });
export const lightTheme = extendTheme({ ...baseTheme, colors: lightColors });
export const darkTheme = extendTheme({ ...baseTheme, colors: darkColors });
