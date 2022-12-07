import { SystemStyleObject } from "@chakra-ui/react";

export const getCustomStyles = () => ({
  control: (provided: SystemStyleObject) => ({
    ...provided,
    bg: "wynd.neutral.100",
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
    scrollbarColor: "wynd.alpha.800",
    // For Chrome and other browsers except Firefox
    "&::-webkit-scrollbar": {
      width: "18px",
      background: "wynd.alpha.200",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "wynd.alpha.100",
      borderRadius: "4px",
    },
  }),
  option: (provided: SystemStyleObject, state: { isSelected: boolean }) => ({
    ...provided,
    borderRadius: "lg",
    bg: state.isSelected ? "wynd.cyan.800" : "transparent",
    color: "inherit",
    _hover: {
      bg: state.isSelected ? "wynd.cyan.500" : "wynd.alpha.200",
    },
    _disabled: {
      _hover: { bg: "transparent" },
    },
  }),
});
