"use client";

import { Badge, Flex, FlexProps, Icon, Text, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

export interface LinkItemProps {
  readonly name: string;
  readonly to: string;
  readonly icon: IconType;
  readonly isExternalLink?: boolean;
  readonly comingSoon?: boolean;
}
import { useTranslation } from "i18next-ssg";
import React, { Suspense } from "react";
import { CgExternal } from "react-icons/cg";
import { UnvotedPropCount } from "./UnvotedPropCount";

const NavItem: React.FC<LinkItemProps & FlexProps> = ({
  to,
  icon,
  name,
  isExternalLink,
  comingSoon,
  ...restProps
}) => {
  const pathname = usePathname();
  const { i18n } = useTranslation("common");
  const langLink = `/${i18n.language}${to}`;
  let isLinkActive: boolean = false;

  // Set styles for active link and children routes, but avoid Dashboard being always styled
  const isExactlyDashboard = langLink === `/${i18n.language}/` && pathname === `/${i18n.language}`;

  if (isExactlyDashboard) {
    isLinkActive = true;
  }
  const isCurrentLinkPathname =
    langLink.startsWith(pathname || "") && pathname && pathname.length > i18n.language?.length + 1;
  if (!isExactlyDashboard && isCurrentLinkPathname) {
    isLinkActive = true;
  }

  return (
    <Link
      href={langLink}
      target={to.startsWith("http") ? "_blank" : "_self"}
      style={{ textDecoration: "none" }}
    >
      <Flex
        align="center"
        p={{ base: "4" }}
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
          {name === "Vote" && (
            <Suspense fallback={<span>...</span>}>
              <UnvotedPropCount />
            </Suspense>
          )}
          {comingSoon && (
            <Badge
              zIndex="4"
              borderRadius="50%"
              display="flex"
              justifyContent="center"
              ml="1"
              alignItems="center"
              fontSize="0.8em"
              colorScheme="blue"
            >
              soon
            </Badge>
          )}
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
                : {
                    color: "white",
                  }
            }
          />
        )}
      </Flex>
    </Link>
  );
};

export default NavItem;
