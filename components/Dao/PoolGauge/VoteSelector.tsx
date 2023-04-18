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
} from "@chakra-ui/react";
import React, { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useClickAway } from "react-use";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { PoolWithAddresses } from ".";
import TokenName from "../../Dex/TokenName";
import { getAssetByDenom, getAssetInfoDetails } from "../../../utils/assets";
import AssetImage from "../../Dex/AssetImage";
import { microdenomToDenom } from "../../../utils/tokens";

interface IProps {
  options: PoolWithAddresses[];
  selectedPool: PoolWithAddresses;
  setSelectedPool: (pool: PoolWithAddresses) => void;
}

const PoolSelector: React.FC<IProps> = ({ options, selectedPool, setSelectedPool }) => {
  const [open, setOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<string>("");
  const dropdownRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const handlerAssetSelector = useCallback(() => {
    if (!open) filterRef.current?.focus();
    setOpen(!open);
  }, [open, filterRef]);

  const changePool = (pool: PoolWithAddresses) => {
    startTransition(() => {
      setSelectedPool(pool);
      setOpen(false);
    });
  };

  const _options = useMemo(
    () =>
      options.filter((option) => {
        const assetDetails1 = getAssetInfoDetails(option.assets[0]);
        const assetDetails2 = getAssetInfoDetails(option.assets[1]);
        if (!assetDetails1 || !assetDetails2) {
          return false;
        }
        return (
          `${microdenomToDenom(assetDetails1.denom)}/${microdenomToDenom(assetDetails2.denom)}`
            .toLowerCase()
            .includes(filter.toLowerCase().trim()) ||
          `${microdenomToDenom(assetDetails2.denom)}/${microdenomToDenom(assetDetails1.denom)}`
            .toLowerCase()
            .includes(filter.toLowerCase().trim())
        );
      }),
    [filter, options],
  );

  useClickAway(dropdownRef, () => setOpen(false));

  const AssetsLi = _options.map((pool) => {
    return (
      <ListItem
        key={pool.staking}
        onClick={() => changePool(pool)}
        p="0.5rem"
        pr="1rem"
        _hover={{ background: "whiteAlpha.200", cursor: "pointer" }}
        borderRadius="lg"
      >
        <Flex alignItems="center" justifyContent="space-between" gap="0.5rem">
          <Flex alignItems="center">
            <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
              <Box
                w={{ base: 6, md: 7, lg: 8 }}
                h={{ base: 6, md: 7, lg: 8 }}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor={"wynd.cyan.100"}
                overflow="hidden"
                p={0.5}
              >
                {/* @ts-ignore */}
                <AssetImage asset={(pool.assets[0].token || pool.assets[0].native) as string} />
              </Box>
              <Box
                position="absolute"
                left={{ base: 4, sm: 5 }}
                w={{ base: 6, md: 7, lg: 8 }}
                h={{ base: 6, md: 7, lg: 8 }}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor={"wynd.cyan.100"}
                overflow="hidden"
                p={0.5}
              >
                {/* @ts-ignore */}
                <AssetImage asset={(pool.assets[1].token || pool.assets[1].native) as string} />
              </Box>
            </Flex>
            {pool.assets[0].hasOwnProperty("native") ? (
              <span>
                {/* @ts-ignore */}
                {`${getAssetByDenom(pool.assets[0].native)?.symbol}`}
              </span>
            ) : (
              // @ts-ignore
              <TokenName symbol={true} address={pool.assets[0].token} />
            )}
            {" / "}
            {pool.assets[1].hasOwnProperty("native") ? (
              <span>
                {/* @ts-ignore */}
                {`${getAssetByDenom(pool.assets[1].native)?.symbol}`}
              </span>
            ) : (
              // @ts-ignore
              <TokenName symbol={true} address={pool.assets[1].token} />
            )}
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
              <Box
                w={{ base: 6, md: 7, lg: 8 }}
                h={{ base: 6, md: 7, lg: 8 }}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor={"wynd.cyan.100"}
                overflow="hidden"
                p={0.5}
              >
                <AssetImage
                  // @ts-ignore
                  asset={(selectedPool.assets[0].token || selectedPool.assets[0].native) as string}
                />
              </Box>
              <Box
                position="absolute"
                left={{ base: 4, sm: 5 }}
                w={{ base: 6, md: 7, lg: 8 }}
                h={{ base: 6, md: 7, lg: 8 }}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor={"wynd.cyan.100"}
                overflow="hidden"
                p={0.5}
              >
                <AssetImage
                  // @ts-ignore
                  asset={(selectedPool.assets[1].token || selectedPool.assets[1].native) as string}
                />
              </Box>
            </Flex>
            {selectedPool.assets[0].hasOwnProperty("native") ? (
              <span>
                {/* @ts-ignore */}
                {`${getAssetByDenom(selectedPool.assets[0].native)?.symbol}`}
              </span>
            ) : (
              // @ts-ignore
              <TokenName symbol={true} address={selectedPool.assets[0].token} />
            )}
            {"  /  "}
            {selectedPool.assets[1].hasOwnProperty("native") ? (
              <span>
                {/* @ts-ignore */}
                {`${getAssetByDenom(selectedPool.assets[1].native)?.symbol}`}
              </span>
            ) : (
              // @ts-ignore
              <TokenName symbol={true} address={selectedPool.assets[1].token} />
            )}
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

export default PoolSelector;
