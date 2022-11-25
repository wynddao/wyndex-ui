import { ColorMode, SystemStyleObject } from "@chakra-ui/react";
import { handleChangeColorModeValue } from "../../../utils/theme";

export const getCustomStyles = (colorMode: ColorMode) => ({
  control: (provided: SystemStyleObject) => ({
    ...provided,
    bg: handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50"),
  }),
  menu: (provided: SystemStyleObject) => ({
    ...provided,
    maxH: { base: "sm", sm: "2xl" },
    position: "relative",
    mt: 6,
    mb: 0,
  }),
  menuList: (provided: SystemStyleObject) => ({
    ...provided,
    bg: "transparent",
    border: "none",
    borderRadius: "none",
    py: 0,
    pr: { base: 2, sm: 4 },
    // For Firefox
    scrollbarWidth: "auto",
    scrollbarColor: handleChangeColorModeValue(
      colorMode,
      "rgba(0,0,0,0.3) rgba(0,0,0,0.2)",
      "rgba(255,255,255,0.2) rgba(255,255,255,0.1)",
    ),
    // For Chrome and other browsers except Firefox
    "&::-webkit-scrollbar": {
      width: "18px",
      background: handleChangeColorModeValue(colorMode, "rgba(160,160,160,0.1)", "rgba(255,255,255,0.1)"),
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: handleChangeColorModeValue(colorMode, "rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)"),
      borderRadius: "4px",
    },
  }),
  option: (provided: SystemStyleObject, state: { isSelected: boolean }) => ({
    ...provided,
    borderRadius: "lg",
    bg: state.isSelected
      ? handleChangeColorModeValue(colorMode, "primary.100", "primary.500")
      : "transparent",
    color: "inherit",
    _hover: {
      bg: state.isSelected
        ? handleChangeColorModeValue(colorMode, "primary.100", "primary.500")
        : handleChangeColorModeValue(colorMode, "blackAlpha.200", "whiteAlpha.200"),
    },
    _disabled: {
      _hover: { bg: "transparent" },
    },
  }),
});
