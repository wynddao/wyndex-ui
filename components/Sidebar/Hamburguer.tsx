"use client";

import { Flex, FlexProps, IconButton } from "@chakra-ui/react";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import { ThemeModes, useTheme } from "../../providers/ThemeProvider";
import wyndLogoBlack from "../../public/logo-black.svg";
import wyndLogoWhite from "../../public/logo-white.svg";

interface MobileProps extends FlexProps {
  readonly onOpen: () => void;
}

export default function Hamburguer({ onOpen, ...restProps }: MobileProps) {
  const { theme } = useTheme();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      gap={4}
      bg={"wynd.base.sidebar"}
      justifyContent="flex-start"
      {...restProps}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />
      <Image
        alt="Wynd logo"
        src={theme === ThemeModes.dark ? wyndLogoWhite : wyndLogoBlack}
        sizes="100vw"
        style={{ width: "100%", height: "auto", maxWidth: 128, maxHeight: 38 }}
      />
    </Flex>
  );
}
