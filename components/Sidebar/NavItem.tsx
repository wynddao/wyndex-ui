"use client";

import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LinkItemProps } from ".";

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
        transition="all linear .5s"
        _hover={
          isLinkActive
            ? {
                bg: "wynd.gray.200",
              }
            : { bg: "wynd.gray.200" }
        }
        {...restProps}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="1rem"
            as={icon}
            sx={
              isLinkActive
                ? {
                    color: "wynd.cyan.500",
                  }
                : undefined
            }
          />
        )}
        <Text
          sx={
            isLinkActive
              ? {
                  bgGradient: "linear(to-l, wynd.green.500, wynd.cyan.500)",
                  bgClip: "text",
                  fontWeight: "extrabold",
                }
              : undefined
          }
        >
          {name}
        </Text>
      </Flex>
    </Link>
  );
}
