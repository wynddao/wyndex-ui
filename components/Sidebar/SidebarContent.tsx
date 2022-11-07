import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Icon,
  Switch,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import {
  FiActivity,
  FiBarChart,
  FiMoon,
  FiPackage,
  FiPieChart,
  FiRefreshCw,
  FiSun,
  FiUsers,
} from "react-icons/fi";
import { LinkItemProps } from ".";
import wyndLogoBlack from "../../public/logo-black.svg";
import wyndLogoWhite from "../../public/logo-white.svg";
import NavItem from "./NavItem";

const LinkItems: readonly LinkItemProps[] = [
  { name: "Dashboard", to: "/", icon: FiActivity },
  { name: "Swap", to: "/swap", icon: FiRefreshCw },
  { name: "Pools", to: "/pools", icon: FiPieChart },
  { name: "Derivative Staking", to: "/derivative-staking", icon: FiBarChart },
  { name: "Governance", to: "https://app.wynddao.com", icon: FiUsers },
];

interface SidebarContentProps extends BoxProps {
  readonly onClose: () => void;
}

export default function SidebarContent({ onClose, ...restProps }: SidebarContentProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: "auto" }}
      pos="fixed"
      h="full"
      {...restProps}
    >
      <Box>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image
            alt="Wynd logo"
            src={useColorModeValue(wyndLogoBlack, wyndLogoWhite)}
            sizes="100vw"
            style={{ width: "100%", height: "auto", maxWidth: 128, maxHeight: 38 }}
          />
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} to={link.to} icon={link.icon} name={link.name} />
        ))}
        <Flex
          align="center"
          p={{ base: "2", lg: "4" }}
          mx={{ base: "2", lg: "4" }}
          borderRadius="lg"
          role="group"
          fontSize={{ base: "14", lg: "16" }}
          cursor="pointer"
          _hover={{
            bg: useColorModeValue("brand.cyan.100", "brand.blue.800"),
            color: "white",
          }}
          {...restProps}
        >
          <Icon
            mr="4"
            fontSize="0.8em"
            _groupHover={{
              color: "white",
            }}
            as={FiPackage}
          />
          Mistery Box
        </Flex>
      </Box>
      <Flex alignItems="center" justifyContent="center" gap={4} m={{ base: "4", lg: "8" }}>
        <Icon
          fontSize={{ base: "md", lg: "lg" }}
          as={FiMoon}
          sx={{ color: useColorModeValue("inherit", "yellow.400") }}
        />
        <Switch
          isChecked={colorMode === "light"}
          onChange={() => toggleColorMode()}
          size={{ base: "md", lg: "lg" }}
        />
        <Icon
          fontSize={{ base: "md", lg: "lg" }}
          as={FiSun}
          sx={{ color: useColorModeValue("orange.500", "inherit") }}
        />
      </Flex>
    </Flex>
  );
}
