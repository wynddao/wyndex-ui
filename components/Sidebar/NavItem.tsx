"use client";

import { Flex, FlexProps, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LinkItemProps } from ".";
import { handleChangeColorModeValue } from "../../utils/theme";

type NavItemProps = LinkItemProps & FlexProps;

export default function NavItem({ to, icon, name, ...restProps }: NavItemProps) {
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
                bg: "wynd.cyan.500",
                color: "wynd.neutral.100",
              }
            : undefined
        }
        _hover={
          isLinkActive
            ? {
                bg: "wynd.cyan.500",
                color: "wynd.neutral.100",
              }
            : { bg: "wynd.neutral.200", color: "wynd-cyan-500" }
        }
        {...restProps}
      >
        {icon && <Icon mr="4" fontSize="0.8em" as={icon} />}
        {name}
      </Flex>
    </Link>
  );
}
