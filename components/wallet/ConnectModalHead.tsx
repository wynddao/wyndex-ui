import {
  Box,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import React, { useRef } from "react";

import { handleChangeColorModeValue } from "../../default-component";
import { ButtonWithTipType, ConnectModalContentHeader, DisplayModalControlButtonType } from "../../types";

const SIZES = {
  lg: {
    iconSize: 6,
    fontSize: "lg",
    popoverMaxWidth: 80,
    popoverContentFontSize: "md",
  },
  md: {
    iconSize: 5,
    fontSize: "md",
    popoverMaxWidth: 72,
    popoverContentFontSize: "sm",
  },
  sm: {
    iconSize: 4,
    fontSize: "sm",
    popoverMaxWidth: 64,
    popoverContentFontSize: "xs",
  },
};

export const DisplayModalControlButton = ({
  size = "md",
  icon,
  handleClick,
}: DisplayModalControlButtonType) => (
  <Button
    variant="unstyled"
    minW="fit-content"
    minH="fit-content"
    w="fit-content"
    h="fit-content"
    display="flex"
    justifyContent="center"
    alignItems="center"
    p={0}
    opacity={0.6}
    _hover={{ opacity: 0.8 }}
    _active={{ opacity: 0.9 }}
    _focus={{ boxShadow: "none" }}
    onClick={handleClick}
  >
    <Icon as={icon} w={SIZES[size].iconSize} h={SIZES[size].iconSize} />
  </Button>
);

export const ButtonTips = ({ size = "md", icon, header, content, placement }: ButtonWithTipType) => {
  const initialFocusRef = useRef();
  const { isOpen, onClose, onToggle } = useDisclosure();
  useOutsideClick({
    ref: initialFocusRef,
    handler: onClose,
  });
  const { colorMode } = useColorMode();

  return (
    <Popover isOpen={isOpen} closeOnBlur={true} isLazy={true} flip={true} placement={placement}>
      <PopoverTrigger>
        <Button
          ref={initialFocusRef}
          variant="unstyled"
          minW="auto"
          minH="auto"
          h="fit-content"
          display="flex"
          p={0}
          opacity={isOpen ? 1 : 0.6}
          _hover={{ opacity: 0.8 }}
          _active={{ opacity: 0.9 }}
          _focus={{ boxShadow: "none" }}
          onClick={onToggle}
        >
          <Icon as={icon} w={SIZES[size].iconSize} h={SIZES[size].iconSize} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="full"
        maxW={SIZES[size].popoverMaxWidth}
        bg={handleChangeColorModeValue(colorMode, "gray.800", "white")}
        borderColor={handleChangeColorModeValue(colorMode, "gray.800", "white")}
        color={handleChangeColorModeValue(colorMode, "white", "gray.800")}
        boxShadow={handleChangeColorModeValue(
          colorMode,
          "0 4px 6px -2px rgba(16, 24, 40, 0.05), 0 12px 16px -4px rgba(16, 24, 40, 0.1)",
          "white",
        )}
        _focus={{ outline: "none" }}
        p={2}
        mx={2}
      >
        <PopoverArrow bg={handleChangeColorModeValue(colorMode, "gray.800", "white")} />
        {header && (
          <PopoverHeader border="none" fontSize={SIZES[size].fontSize} fontWeight="semibold" pb={0}>
            {header}
          </PopoverHeader>
        )}
        <PopoverBody fontSize={SIZES[size].popoverContentFontSize}>{content}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const ModalHead = ({ size = "md", title, leftButton, rightButton }: ConnectModalContentHeader) => {
  const { colorMode } = useColorMode();
  return (
    <Stack
      position="relative"
      w="full"
      isInline={true}
      alignItems="center"
      h="fit-content"
      p={4}
      borderBottom="1px solid"
      borderColor={handleChangeColorModeValue(colorMode, "gray.200", "gray.700")}
    >
      {leftButton && (
        <Box position="relative" zIndex="popover">
          {leftButton}
        </Box>
      )}
      <Box flex={1}>
        <Text
          fontSize={SIZES[size].fontSize}
          fontWeight="medium"
          textAlign={!leftButton ? "start" : "center"}
        >
          {title}
        </Text>
      </Box>
      {rightButton && <Box>{rightButton}</Box>}
    </Stack>
  );
};
