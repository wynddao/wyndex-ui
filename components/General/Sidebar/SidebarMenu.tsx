import { MenuItem, Menu, MenuButton, MenuList, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import { FiUsers } from "react-icons/fi";

export const SidebarMenu = () => {
  const pathname = usePathname();
  const isLinkActive =
    pathname?.includes("vote") || pathname?.includes("stake") || pathname?.includes("gauge");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Menu isOpen={isOpen} closeOnBlur={true} onClose={() => setIsOpen(false)}>
      <MenuButton
        _hover={{ bg: "wynd.gray.300" }}
        aria-label="Courses"
        fontWeight="normal"
        width="100%"
        borderRadius={"xl"}
        onClick={() => setIsOpen(!isOpen)}
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
          justifyContent="space-between"
        >
          <Flex align="center">
            <Icon
              mr="4"
              sx={
                isLinkActive
                  ? {
                      color: "wynd.cyan.500",
                    }
                  : undefined
              }
              fontSize={{ base: "1rem", lg: "20px" }}
              as={FiUsers}
            />
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
              Governance
            </Text>
          </Flex>
          <Icon
            alignSelf={"end"}
            mr="4"
            fontSize={{ base: "1rem", lg: "20px" }}
            as={isOpen ? CgChevronUp : CgChevronDown}
          />
        </Flex>
      </MenuButton>
      <MenuList ml={2}>
        <MenuItem justifyContent={"center"}>
          <Link href="/stake">Stake</Link>
        </MenuItem>
        <MenuItem justifyContent={"center"}>
          <Link href="/vote">Vote</Link>
        </MenuItem>
        <MenuItem justifyContent={"center"}>
          <Link href="/gauges">Gauges</Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
