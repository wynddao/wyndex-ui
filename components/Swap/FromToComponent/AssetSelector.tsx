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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { Asset, assetList, CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { useClickAway } from "react-use";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

interface IProps {
  selectedAsset: Asset | IBCAsset | CW20Asset;
  setAsset: (asset: Asset | IBCAsset | CW20Asset) => void;
}

const AssetSelector: React.FC<IProps> = ({ selectedAsset, setAsset }) => {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => setOpen(false));

  const changeAsset = (asset: Asset | IBCAsset | CW20Asset) => {
    setAsset(asset);
    setOpen(false);
  };

  const AssetsLi = assetList.tokens.map((asset) => {
    return (
      <ListItem
        key={asset.name}
        onClick={() => changeAsset(asset)}
        p="0.5rem"
        pr="1rem"
        _hover={{ background: "whiteAlpha.200", cursor: "pointer" }}
        borderRadius="lg"
      >
        <Flex alignItems="center" justifyContent="start" gap="0.5rem">
          <Image alt={asset.name} src={asset.logoURI} w="2rem" h="2rem" />
          <Text fontWeight="bold" fontSize="md" textTransform="capitalize">
            {asset.name.toLowerCase()}
          </Text>
        </Flex>
      </ListItem>
    );
  });

  return (
    <Box position="relative">
      <Button
        as={motion.button}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        variant="ghost"
        minH="4rem"
        minW="13rem"
        bg={open ? "whiteAlpha.200" : "transparent"}
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
        width="100%"
        borderRadius="lg"
        transform={open ? "scale(1)" : "scale(0)"}
        initial={false}
        transition="all linear 0.2s"
        maxH="15rem"
        display="flex"
        alignItems="center"
        flexFlow="column"
        gap="1rem"
        maxWidth="fit-content"
        ref={dropdownRef}
      >
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={IoSearch} w="1rem" h="1rem" color={"wynd.neutral.900"} />
          </InputLeftElement>
          <Input placeholder="search..." borderRadius="md" bg="wynd.base.subBg" border="none" />
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

export default AssetSelector;