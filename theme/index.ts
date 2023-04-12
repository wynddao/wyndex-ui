import { extendTheme } from "@chakra-ui/react";
import { darkColors } from "./colors";
import { typography } from "./typography";
import { breakpoints } from "./breakpoints";
import { styles } from "./global";
import { components } from "./components";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const baseTheme = extendTheme({ breakpoints, styles, ...typography, components, colors: darkColors });
export const darkTheme = extendTheme({ ...baseTheme, colors: darkColors });
