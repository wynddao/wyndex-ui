import {
  Box,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { AiFillSetting } from "react-icons/ai";
import CurrencySwitcher from "./CurrencySwitcher";

const Settings: React.FC = () => {
  const { onToggle, onClose, isOpen } = useDisclosure();
  const initialFocusRef = useRef(null);

  const handlerClick = () => {
    onToggle();
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialFocusRef}
        placement="auto"
        matchWidth
      >
        <PopoverTrigger>
          <Box
            as={motion.button}
            alignSelf="start"
            className="general-settings"
            _focus={{ boxShadow: "none" }}
            onClick={handlerClick}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
            backgroundColor={"wynd.gray.alpha.20"}
            _hover={{ backgroundColor: "wynd.gray.alpha.10" }}
            py="1"
            px="2"
            gap="0.5rem"
            width="100%"
          >
            <Icon w="24px" h="24px" as={AiFillSetting} padding="2px" />
            <Text onClick={handlerClick} display={{ base: "inline-flex" }} fontWeight="xl">
              Settings
            </Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent
          w="full"
          maxW="200px"
          bg={"wynd.base.sidebar"}
          boxShadow="md"
          marginInline="auto"
          className="swap-popover"
          border={{ base: "1px solid" }}
          borderColor={{ base: "whiteAlpha.300" }}
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
