"use client";

import { Box, CloseButton, Flex, FlexProps, IconButton, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import { ThemeModes, useTheme } from "../../../providers/ThemeProvider";
import wyndLogoBlack from "../../../public/logo-black.svg";
import wyndLogoWhite from "../../../public/logo-white.svg";

interface MobileProps extends FlexProps {
  readonly onOpen: () => void;
  readonly onClose: () => void;
  readonly isOpen: boolean;
}

export default function Hamburguer({ onOpen, onClose, isOpen, ...restProps }: MobileProps) {
  const { theme } = useTheme();

  const toggle = () => {
    isOpen ? onClose() : onOpen();
  };
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      gap={4}
      bg={"rgba(16, 11, 22,0.8)"}
      backdropFilter="blur(10px)"
      justifyContent="space-between"
      {...restProps}
      position="sticky"
      top="0"
      zIndex="9999999"
    >
      <Flex justifyItems="start" alignItems="center" gap="4">
        <Image
          alt="Wynd logo"
          src={theme === ThemeModes.dark ? wyndLogoWhite : wyndLogoBlack}
          sizes="100vw"
          style={{ width: "100%", height: "auto", maxWidth: 128, maxHeight: 38 }}
        />
      </Flex>
      <Box
        display={{ base: "flex", md: "none" }}
        flexFlow="column"
        gap="0.4rem"
        cursor="pointer"
        onClick={toggle}
        p="2"
        border="1px solid"
        borderColor="wynd.gray.400"
        rounded="md"
        w="40px"
        _hover={{ background: "whiteAlpha.200" }}
      >
        <Text
          bg={"wynd.gray.900"}
          h="2px"
          rounded="lg"
          w="100%"
          transform={isOpen ? "rotate(45deg) translateX(5px) translateY(5px)" : ""}
          transition="all linear 0.3s"
        />
        <Text
          bg={"wynd.gray.900"}
          h="2px"
          rounded="lg"
          w="100%"
          opacity={isOpen ? "0" : "1"}
          transition="all linear 0.3s"
        />
        <Text
          bg={"wynd.gray.900"}
          h="2px"
          rounded="lg"
          w="100%"
          transform={isOpen ? "rotate(-45deg) translateX(6px) translateY(-6px)" : ""}
          transition="all linear 0.3s"
        />
      </Box>
    </Flex>
  );
}
