"use client";

import { Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

export interface LinkItemProps {
  readonly name: string;
  readonly to: string;
  readonly icon: IconType;
  readonly isExternalLink?: boolean;
}

import React from "react";
import { CgExternal } from "react-icons/cg";

const NavItem: React.FC<LinkItemProps & FlexProps> = ({ to, icon, name, isExternalLink, ...restProps }) => {
  const pathname = usePathname();

  // Set styles for active link and children routes, but avoid Dashboard being always styled
  const isExactlyDashboard = to === "/" && pathname === "/";
  const toNoSlash = to.slice(1);
  const pathnameNoSlash = pathname?.slice(1);
  const isCurrentLinkPathname = toNoSlash && pathnameNoSlash && pathnameNoSlash.startsWith(toNoSlash);
  const isLinkActive = isExactlyDashboard || isCurrentLinkPathname;

  return (
    <Link href={to} target={to.startsWith("http") ? "_blank" : "_self"} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p={{ base: "4" }}
        mx={{ base: "2" }}
        borderRadius="lg"
        role="group"
        fontSize={{ base: "16" }}
        cursor="pointer"
        transition="all linear .5s"
        _hover={{ bg: "wynd.gray.300" }}
        {...restProps}
        justifyContent="space-between"
      >
        <Flex align="center">
          {icon && (
            <Icon
              mr="4"
              fontSize={{ base: "1rem", lg: "20px" }}
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
        {isExternalLink && (
          <Icon
            mr="4"
            fontSize={{ base: "1rem", lg: "20px" }}
            as={CgExternal}
            sx={
              isLinkActive
                ? {
                    color: "wynd.green.500",
                  }
                : undefined
            }
          />
        )}
      </Flex>
    </Link>
  );
};

export default NavItem;
