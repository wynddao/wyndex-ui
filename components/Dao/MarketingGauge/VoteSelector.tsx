"use client";;
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useRef, useState, useTransition } from "react";
import { useClickAway } from "react-use";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { OptionsWithInfos } from ".";
import AssetImage from "../../Dex/AssetImage";

interface IProps {
  options: OptionsWithInfos[];
  selectedOption: OptionsWithInfos;
  setSelectedOption: (option: OptionsWithInfos) => void;
}

const VoteSelector: React.FC<IProps> = ({ options, selectedOption, setSelectedOption }) => {
  const [open, setOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<string>("");
  const dropdownRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const handlerAssetSelector = useCallback(() => {
    if (!open) filterRef.current?.focus();
    setOpen(!open);
  }, [open, filterRef]);

  const changeOption = (option: OptionsWithInfos) => {
    startTransition(() => {
      setSelectedOption(option);
      setOpen(false);
    });
  };

  const _options = options.filter((option) => {
    return option.name.toLowerCase().includes(filter.toLowerCase().trim());
  });

  useClickAway(dropdownRef, () => setOpen(false));

  const AssetsLi = _options.map((option) => {
    return (
      <ListItem
        key={option.address}
        onClick={() => changeOption(option)}
        p="0.5rem"
        pr="1rem"
        _hover={{ background: "whiteAlpha.200", cursor: "pointer" }}
        borderRadius="lg"
      >
        <Flex alignItems="center" justifyContent="space-between" gap="0.5rem">
          <Flex alignItems="center">
            <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
              <Text>{option.name}</Text>
            </Flex>
          </Flex>
        </Flex>
      </ListItem>
    );
  });

  return (
    <Box position="relative" ref={dropdownRef}>
      <Button
        as={motion.button}
        whileTap={{ scale: 0.95 }}
        onClick={handlerAssetSelector}
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        variant="ghost"
        minH="4rem"
        minW="13rem"
        bg={open ? "whiteAlpha.200" : "transparent"}
      >
        <Flex alignItems="center" justifyContent="space-between" gap="0.5rem">
          <Flex alignItems="center">
            <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
              <Text>{selectedOption?.name}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Icon
          as={IoIosArrowDown}
          w="1rem"
          h="1rem"
          color={"wynd.neutral.900"}
          transform={open ? "rotate(180deg)" : ""}
          transition="all linear 0.2s"
        />
      </Button>
      <Box
        as={List}
        zIndex={5}
        bg="whiteAlpha.200"
        backdropFilter="blur(20px)"
        padding="1rem"
        listStyleType="none"
        className="asset-Box-list"
        position="absolute"
        left="0"
        mt="0.5rem"
        borderRadius="lg"
        transform={open ? "scale(1)" : "scale(0)"}
        transition="all linear 0.2s"
        maxH="15rem"
        display="flex"
        alignItems="center"
        flexFlow="column"
        gap="1rem"
        ref={dropdownRef}
      >
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={IoSearch} w="1rem" h="1rem" color={"wynd.neutral.900"} />
          </InputLeftElement>
          <Input
            ref={filterRef}
            placeholder="search..."
            borderRadius="md"
            bg="wynd.base.subBg"
            border="none"
            onChange={({ target }) => setFilter(target.value)}
          />
        </InputGroup>
        <List
          overflowY="scroll"
          w="full"
          borderRadius="md"
          bg="wynd.base.subBg"
          flexFlow="column"
          gap="0.5rem"
          sx={{
            "&::-webkit-scrollbar": {
              backgroundColor: "transparent",
              width: "0.5rem",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `wynd.cyan.400`,
              borderRadius: "md",
            },
          }}
          listStyleType="none"
        >
          {AssetsLi}
        </List>
      </Box>
    </Box>
  );
};

export default VoteSelector;
