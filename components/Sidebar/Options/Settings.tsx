import React, { useRef, useState } from "react";
import {
  Button,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  Box,
  Flex,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { AiFillSetting } from "react-icons/ai";
import CurrencySwitcher from "./CurrencySwitcher";
import { motion, useAnimation } from "framer-motion";

const Settings: React.FC = () => {
  const { onToggle, onClose, isOpen } = useDisclosure();
  const controls = useAnimation();
  const initialFocusRef = useRef(null);

  const handlerClick = () => {
    controls.start({ rotate: 90, transition: { duration: 0.2 }, transitionEnd: { rotate: 0 } });
    onToggle();
  };

  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose} initialFocusRef={initialFocusRef} placement="right-end">
        <PopoverTrigger>
          <Box
            as={motion.button}
            alignSelf="start"
            className="general-settings"
            animate={controls}
            _focus={{ boxShadow: "none" }}
            onClick={handlerClick}
            whileHover={{
              scale: 1.2,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            top={{ base: "initial", md: "3.5rem" }}
            right={{ base: "initial", md: "-10px" }}
            left={{ base: "1rem", md: "initial" }}
            bottom={{ base: "9.5rem", md: "initial" }}
            gap="0.5rem"
          >
            <Icon
              w={{ base: "32px", md: "24px" }}
              h={{ base: "32px", md: "24px" }}
              as={AiFillSetting}
              bg="whiteAlpha.300"
              borderRadius="full"
              padding="2px"
            />
          </Box>
        </PopoverTrigger>
        <Text
          onClick={handlerClick}
          display={{ base: "inline-flex", md: "none" }}
          position="absolute"
          left={{ base: "3.2rem", md: "initial" }}
          bottom={{ base: "9.7rem", md: "initial" }}
          fontWeight="xl"
        >
          Settings
        </Text>
        <PopoverContent
          bg={"wynd.base.sidebar"}
          boxShadow="md"
          right="-2px"
          top="-4px"
          className="swap-popover"
          border={{ base: "1px solid", md: "none" }}
          borderColor={{ base: "wynd.gray.500", md: "none" }}
        >
          <PopoverHeader pt={4} fontWeight="bold" border="0" fontSize="xl">
            Settings
          </PopoverHeader>
          <PopoverCloseButton top="1rem" />
          <PopoverBody p={{ base: 2, md: 4 }}>
            <Flex flexFlow="column" w="100%">
              <Flex justifyContent="space-between" w="full" alignItems="center">
                <Text color={"wynd.gray.800"}>Currency</Text>
                <CurrencySwitcher />
              </Flex>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Settings;
