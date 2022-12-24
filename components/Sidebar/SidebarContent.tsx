"use client";;
import { Box, BoxProps, CloseButton, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { FiActivity, FiPackage, FiPieChart, FiRefreshCw, FiUsers } from "react-icons/fi";
import { useTheme } from "../../providers/ThemeProvider";
import wyndLogoWhite from "../../public/logo-white.svg";
import GradientIcon from "../Swap/FromToComponent/GradientIcon";
import ConnectWalletButton from "./ConnectWalletButton";
import NavItem, { LinkItemProps } from "./NavItem";
import OnRampButton from "./OnRamp/OnRampButton";
import Settings from "./Options/Settings";

const LinkItems: readonly LinkItemProps[] = [
  { name: "Dashboard", to: "/", icon: FiActivity },
  { name: "Swap", to: "/swap", icon: FiRefreshCw },
  { name: "Pools", to: "/pools", icon: FiPieChart },
  { name: "Governance", to: "https://app.wynddao.com", icon: FiUsers, isExternalLink: true },
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
      bg={"wynd.base.sidebar"}
      w={{ base: "full", md: "fit-content" }}
      h="100vh"
      {...restProps}
    >
      <Box>
        <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
          <Image
            alt="Wynd logo"
            src={wyndLogoWhite}
            sizes="100vw"
            style={{ width: "100%", height: "auto", maxWidth: 128, maxHeight: 38 }}
          />
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            to={link.to}
            icon={link.icon}
            name={link.name}
            isExternalLink={link.isExternalLink}
          />
        ))}
      </Box>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={{ base: 2 }}
        p={{ base: "4" }}
      >
        <GradientIcon id="settingsGradient" gradient1="#AFEFBD" gradient2="#75E4F9" />
        <Settings />
        <ConnectWalletButton />
        <OnRampButton />
      </Flex>
    </Flex>
  );
}
