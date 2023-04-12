import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { motion } from "framer-motion";
import React, { startTransition, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useClickAway } from "react-use";
import { useIndexerInfos } from "../../../../state";
import { getAssetList } from "../../../../utils/getAssetList";
import { microamountToAmount } from "../../../../utils/tokens";

interface AssetSelectorProps {
  readonly selectedAsset: Asset;
  readonly setAsset: (asset: Asset) => void;
  readonly hiddenTokens: readonly Asset[];
}

const AssetSelector: React.FC<AssetSelectorProps> = ({ selectedAsset, setAsset, hiddenTokens }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { ibcBalances, cw20Balances } = useIndexerInfos({ fetchIbcBalances: true, fetchCw20Balances: true });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState("");

  useClickAway(dropdownRef, onClose);

  const changeAsset = (asset: Asset) => {
    startTransition(() => {
      setAsset(asset);
      onClose();
    });
  };

  const handlerAssetSelector = () => {
    if (!isOpen) filterRef.current?.focus();
    onToggle();
  };

  const assets = getAssetList().tokens;
  const filteredAssets = assets.filter(({ name, symbol }) => {
    if (
      hiddenTokens.find(
        (el) =>
          el.name.toLowerCase().includes(name.toLowerCase()) ||
          el.symbol.toLowerCase().includes(symbol.toLowerCase()),
      )
    ) {
      return false;
    }

    return (
      name.toLowerCase().includes(filter.toLowerCase()) || symbol.toLowerCase().includes(filter.toLowerCase())
    );
  });
  const assetsWithBalances = filteredAssets.map((asset) => {
    const balance =
      asset.tags === "cw20"
        ? cw20Balances.find((el) => el.address === asset.token_address)?.balance || "0"
        : ibcBalances.find((el) => el.denom === asset.juno_denom || el.denom === asset.denom)?.amount || "0";

    return { ...asset, balance: microamountToAmount(balance, asset.decimals) };
  });
  const sortedAssets = assetsWithBalances.sort((a, b) => Number(b.balance) - Number(a.balance));

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
        bg={isOpen ? "whiteAlpha.200" : "transparent"}
      >
        <Flex alignItems="center" justifyContent="center" gap="1rem">
          <Image alt={selectedAsset.name} src={selectedAsset.logoURI} w="2.5rem" h="2.5rem" />
          <Text textTransform="capitalize" fontSize="xl">
            {selectedAsset.name.toLowerCase()}
          </Text>
        </Flex>
        <Icon
          as={IoIosArrowDown}
          w="1rem"
          h="1rem"
          color={"wynd.neutral.900"}
          transform={isOpen ? "rotate(180deg)" : ""}
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
        width="150%"
        borderRadius="lg"
        transform={isOpen ? "scale(1)" : "scale(0)"}
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
          {sortedAssets.map((asset) => (
            <ListItem
              key={asset.name}
              onClick={() => changeAsset(asset)}
              p="0.5rem"
              pr="1rem"
              _hover={{ background: "whiteAlpha.200", cursor: "pointer" }}
              borderRadius="lg"
            >
              <Flex alignItems="center" justifyContent="space-between" gap="0.5rem">
                <Flex alignItems="center">
                  <Image alt={asset.name} src={asset.logoURI} w="2rem" h="2rem" />
                  <Text ml={2} fontWeight="bold" fontSize="md" textTransform="capitalize">
                    {asset.name.toLowerCase()}
                  </Text>
                </Flex>
                <Text ml={4} fontSize="xs" color="wynd.neutral.500">
                  {asset.balance}
                </Text>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default AssetSelector;
