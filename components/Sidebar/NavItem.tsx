"use client";

import { Flex, FlexProps, Icon, useColorMode, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LinkItemProps } from ".";
import { handleChangeColorModeValue } from "../../utils/theme";

type NavItemProps = LinkItemProps & FlexProps;

export default function NavItem({ to, icon, name, ...restProps }: NavItemProps) {
  const { colorMode } = useColorMode();
  const pathname = usePathname();

  // Set styles for active link and children routes, but avoid Dashboard being always styled
  const isExactlyDashboard = to === "/" && pathname === "/";
  const toNoSlash = to.slice(1);
  const pathnameNoSlash = pathname?.slice(1);
  const isCurrentLinkPathname = toNoSlash && pathnameNoSlash && pathnameNoSlash.startsWith(toNoSlash);
  const isLinkActive = isExactlyDashboard || isCurrentLinkPathname;

  return (
    <Link href={to} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p={{ base: "2", lg: "4" }}
        mx={{ base: "2", lg: "4" }}
        borderRadius="lg"
        role="group"
        fontSize={{ base: "14", lg: "16" }}
        cursor="pointer"
        sx={
          isLinkActive
            ? {
                bg: handleChangeColorModeValue(colorMode, "brand.blue.100", "brand.blue.900"),
                color: "white",
              }
            : undefined
        }
        _hover={{ bg: useColorModeValue("brand.cyan.100", "brand.blue.800"), color: "white" }}
        {...restProps}
      >
        {icon && <Icon mr="4" fontSize="0.8em" as={icon} />}
        {name}
      </Flex>
    </Link>
  );
}
