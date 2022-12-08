"use client";

import { Box, BoxProps, CloseButton, Flex, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { FiActivity, FiPackage, FiPieChart, FiRefreshCw, FiUsers } from "react-icons/fi";
import { LinkItemProps } from ".";
import { ThemeModes, useTheme } from "../../providers/ThemeProvider";
import wyndLogoBlack from "../../public/logo-black.svg";
import wyndLogoWhite from "../../public/logo-white.svg";
import ConnectWalletButton from "./ConnectWalletButton";
import NavItem from "./NavItem";
import ThemeSwitcher from "./ThemeSwitcher";

const LinkItems: readonly LinkItemProps[] = [
  { name: "Dashboard", to: "/", icon: FiActivity },
  { name: "Swap", to: "/swap", icon: FiRefreshCw },
  { name: "Pools", to: "/pools", icon: FiPieChart },
  { name: "Governance", to: "https://app.wynddao.com", icon: FiUsers },
  { name: "Mystery Box", to: "/mystery-box", icon: FiPackage },
];

interface SidebarContentProps extends BoxProps {
  readonly onClose: () => void;
}

export default function SidebarContent({ onClose, ...restProps }: SidebarContentProps) {
  const { theme } = useTheme();
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      bg={"wynd.base.background"}
      borderRight="1px"
      borderRightColor="wynd.neutral.400"
      w={{ base: "full", md: "auto" }}
      pos="fixed"
      h="full"
      {...restProps}
    >
      <Box>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image
            alt="Wynd logo"
            src={theme === ThemeModes.dark ? wyndLogoWhite : wyndLogoBlack}
            sizes="100vw"
            style={{ width: "100%", height: "auto", maxWidth: 128, maxHeight: 38 }}
          />
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} to={link.to} icon={link.icon} name={link.name} />
        ))}
      </Box>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={{ base: 1, lg: 2 }}
        m={{ base: "4", lg: "8" }}
      >
        <ThemeSwitcher />
        <ConnectWalletButton />
      </Flex>
    </Flex>
  );
}
