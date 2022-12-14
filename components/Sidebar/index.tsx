"use client";

import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect } from "react";
import { IconType } from "react-icons";
import { CHAIN_NAME } from "../../utils";
import Hamburguer from "./Hamburguer";
import SidebarContent from "./SidebarContent";

export interface LinkItemProps {
  readonly name: string;
  readonly to: string;
  readonly icon: IconType;
}

interface SidebarProps {
  readonly children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setCurrentChain } = useWallet();

  useEffect(() => {
    setCurrentChain(CHAIN_NAME);
  }, [setCurrentChain]);

  return (
    <Box minH="100vh" bg={"wynd.base.subBg"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "flex" }}
        minWidth={{ base: 0, md: 60, xl: 228 }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Hamburguer display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60, xl: 228 }} pl={{ base: "0" }}>
        {children}
      </Box>
    </Box>
  );
}
