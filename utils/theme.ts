// Color mode helper
export function handleChangeColorModeValue(colorMode: string, light: string, dark: string) {
  if (colorMode === "light") return light;
  if (colorMode === "dark") return dark;
}
