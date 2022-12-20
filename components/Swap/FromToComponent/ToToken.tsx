import { Box, Flex, Text } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";

import React from "react";
import { getDenom } from "../../../utils/assets";
import { microamountToAmount } from "../../../utils/tokens";
import AssetSelector from "./AssetSelector";

interface IProps {
  fromToken: Asset;
  toToken: Asset;
  setToToken: (asset: Asset) => void;
  expectedAmount: string;
}

const ToToken: React.FC<IProps> = ({ fromToken, toToken, setToToken, expectedAmount }) => {
  return (
    <Box flex="1">
      <Text fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }} textAlign="right">
        To
      </Text>
      <Box
        p={4}
        borderRadius="lg"
        bg="wynd.base.sidebar"
        display="flex"
        flexFlow="column"
        pl={{ lg: "2rem" }}
        className="swap-to"
        minHeight="120px"
        justifyContent="end"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <AssetSelector
            selectedAsset={toToken}
            setAsset={setToToken}
            hiddenTokens={[fromToken.name.toLowerCase(), toToken.name.toLowerCase()]}
          />
          <Flex flexFlow="column" position="relative">
            <Flex alignItems="center" gap="0.5rem">
              <Text textTransform="uppercase">
                ≈ {microamountToAmount(expectedAmount, toToken.decimals, 6)} {getDenom(toToken)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default ToToken;
