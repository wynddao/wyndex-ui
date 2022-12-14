import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { Asset, assetList, CW20Asset, IBCAsset } from "@wynddao/asset-list";
import React, { useState } from "react";
import AssetSelector from "./AssetSelector";

interface IProps {
  fromToken: Asset | IBCAsset | CW20Asset;
  setFromToken: (asset: Asset | IBCAsset | CW20Asset) => void;
}

const FromToken: React.FC<IProps> = ({ fromToken, setFromToken }) => {
  return (
    <Box flex="1" minH="120px">
      <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
        From
      </Text>
      <Box
        p={4}
        borderRadius="lg"
        bg="wynd.base.sidebar"
        display="flex"
        flexFlow="column"
        pr={{ lg: "2rem" }}
        className="swap-from"
      >
        <Flex gap="0.5rem" alignSelf="end" alignItems="center" justifyContent="center">
          <Text color="wynd.neutral.500" textTransform="uppercase" fontSize="xs">
            Available 0.1222 {fromToken.denom.slice(1)}
          </Text>
          <Button variant="ghost" fontSize="xs" textTransform="uppercase" size="xs">
            Max
          </Button>
          <Button variant="ghost" fontSize="xs" textTransform="uppercase" size="xs">
            Half
          </Button>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <AssetSelector selectedAsset={fromToken} setAsset={setFromToken} />
          <Flex flexFlow="column" position="relative">
            <Flex alignItems="center" gap="0.5rem">
              <Input
                name=""
                textAlign="right"
                border="none"
                _focus={{ bg: "whiteAlpha.200" }}
                _focus-visible={{ borderColor: "none", boxShadow: "none" }}
                _hover={{ bg: "whiteAlpha.200" }}
                p="0.2rem"
              />
              <Text textTransform="uppercase">{fromToken.denom.slice(1)}</Text>
            </Flex>
            <Text position="absolute" right="0" bottom="-6px" fontSize="xs" color="wynd.neutral.500">
              ≈$ 777
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default FromToken;
