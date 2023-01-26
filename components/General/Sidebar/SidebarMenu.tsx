import { MenuItem, Menu, MenuButton, MenuList, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import { FiUsers } from "react-icons/fi";

export const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Menu isOpen={isOpen} closeOnBlur={true} onClose={() => setIsOpen(false)}>
      <MenuButton
        _hover={{ bg: "wynd.base.sidebar" }}
        aria-label="Courses"
        fontWeight="normal"
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
            <Icon mr="4" fontSize={{ base: "1rem", lg: "20px" }} as={FiUsers} />
            <Text>Governance</Text>
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
