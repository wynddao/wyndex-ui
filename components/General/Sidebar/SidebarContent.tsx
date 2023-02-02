"use client";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { FiActivity, FiPieChart, FiRefreshCw, FiUsers } from "react-icons/fi";
import wyndLogoWhite from "../../../public/logo-white.svg";
import ConnectWalletButton from "./ConnectWalletButton";
import NavItem, { LinkItemProps } from "./NavItem";
import OnRampButton from "./OnRamp/OnRampButton";
import Settings from "./Options/Settings";
import { SidebarMenu } from "./SidebarMenu";

const LinkItems: readonly LinkItemProps[] = [
  { name: "Dashboard", to: "/", icon: FiActivity },
  { name: "Swap", to: "/swap", icon: FiRefreshCw },
  { name: "Pools", to: "/pools", icon: FiPieChart },
];

interface SidebarContentProps extends BoxProps {
  readonly onClose: () => void;
}

export default function SidebarContent({ onClose, ...restProps }: SidebarContentProps) {
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      bg={"wynd.base.sidebar"}
      w={{ base: "full", md: "fit-content" }}
      h="100vh"
      {...restProps}
    >
      <Box>
        <Flex h="80px" alignItems="center" mx="4" justifyContent="center">
          <Box display={{ base: "none", md: "block" }}>
            <Image
              alt="Wynd logo"
              src={wyndLogoWhite}
              sizes="100vw"
              style={{ height: "auto", maxWidth: 128, maxHeight: 38 }}
            />
          </Box>
        </Flex>
        {LinkItems.map((link) => (
          <NavItem
            onClick={onClose}
            key={link.name}
            to={link.to}
            icon={link.icon}
            name={link.name}
            isExternalLink={link.isExternalLink}
          />
        ))}
        <SidebarMenu />
      </Box>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={{ base: 2 }}
        p={{ base: "4" }}
      >
        <Settings />
        <ConnectWalletButton />
        <OnRampButton />
      </Flex>
    </Flex>
  );
}
