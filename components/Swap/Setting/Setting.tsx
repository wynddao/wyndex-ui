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
} from "@chakra-ui/react";
import { BsHexagon, BsHexagonFill, BsExclamationCircleFill } from "react-icons/bs";
import { RiSettings4Fill } from "react-icons/ri";

import RadioTag from "./RadioTag";

interface IProps {
  slippage: number;
  setSlippage: (slippage: number) => void;
}

const Settings: React.FC<IProps> = ({ slippage, setSlippage }) => {
  const { onToggle, onClose, isOpen } = useDisclosure();
  const initialFocusRef = useRef(null);
  const options = ["1", "3", "5", "custom"];
  const defaultOption = () => {
    if (slippage === 1 || slippage === 3 || slippage === 5) {
      return slippage.toString();
    }
    return "custom";
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} initialFocusRef={initialFocusRef}>
      <PopoverTrigger>
        <Button
          className="swap-settings-options"
          position="relative"
          variant="unstyled"
          w="min"
          h="min"
          color={isOpen ? "wynd.cyan.500" : "WhiteAlpha.700"}
          transition="all linear 0.5s"
          _hover={{
            color: isOpen ? "wynd.cyan.500" : "wynd.cyan.400",
          }}
          _focus={{ boxShadow: "none" }}
          onClick={onToggle}
        >
          <Icon zIndex={-10} as={BsHexagonFill} w={8} h={8} color={"wynd.alpha.500"} />
          <Icon position="absolute" top={0} left={1} right={0} zIndex={10} as={BsHexagon} w={8} h={8} />
          <Icon position="absolute" top={2} left={3} right={2} w={4} h={4} as={RiSettings4Fill} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bg={"wynd.base.sidebar"}
        borderColor={"WhiteAlpha.700"}
        boxShadow="md"
        w={{ xl: "fit-content" }}
        right={4} 
        className="swap-popover"
      >
        <PopoverBody p={{ base: 6, md: 8 }}>
          <Text fontWeight="semibold" mb={1.5}>
            Transaction Setting
          </Text>
          <Box fontWeight="semibold" color={"wynd.alpha.700"} mb={4} display="flex" alignItems="center">
            Slippage tolerance&ensp;
            <Icon as={BsExclamationCircleFill} color="wynd.cyan.600" />
          </Box>
          <Flex width="100%" justifyContent="space-between" gap={2}>
            {options.map((value) => {
              return (
                <RadioTag key={value} value={value} setSlippage={setSlippage} selected={defaultOption()} />
              );
            })}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Settings;
