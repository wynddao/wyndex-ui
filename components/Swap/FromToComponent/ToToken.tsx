import { Box, Flex, Text } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";

import React from "react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../state";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { getAmountByPrice, getDenom } from "../../../utils/assets";
import { formatCurrency } from "../../../utils/currency";
import { microamountToAmount } from "../../../utils/tokens";
import AssetSelector from "./AssetSelector";

interface IProps {
  fromToken: Asset;
  toToken: Asset;
  setToToken: (asset: Asset) => void;
  expectedAmount: string;
  inputAmount: string;
}

const ToToken: React.FC<IProps> = ({ fromToken, toToken, setToToken, expectedAmount, inputAmount }) => {
  const currency = useRecoilValue(currencyAtom);
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });
  const price = getAmountByPrice(
    (Number(expectedAmount) / 1000000).toString(),
    currency,
    toToken,
    assetPrices,
  );
  const priceFrom = getAmountByPrice(Number(inputAmount).toString(), currency, fromToken, assetPrices);

  const impact = 100 - (price / priceFrom) * 100;

  return (
    <Box flex="1">
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
        <Text fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }} textAlign="left">
          To
        </Text>
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
              <Text position="absolute" right="0" bottom="-4" fontSize="xs" color="wynd.neutral.500">
                ≈ {formatCurrency(currency, `${price.toFixed(6)}`)} (-{impact.toFixed(2)} %)
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default ToToken;
