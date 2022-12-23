import React from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { Coin } from "cosmwasm";
import { getDenom, getAmountByPrice } from "../../../utils/assets";
import { microamountToAmount } from "../../../utils/tokens";
import AssetSelector from "./AssetSelector";
import { useRecoilValue } from "recoil";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { useIndexerInfos } from "../../../state";
import { formatCurrency } from "../../../utils/currency";

interface IProps {
  toToken: Asset;
  fromToken: Asset;
  setFromToken: (asset: Asset) => void;
  inputAmount: string;
  setInputAmount: (amount: string) => void;
  balance: Coin;
}

const FromToken: React.FC<IProps> = ({
  toToken,
  fromToken,
  setFromToken,
  inputAmount,
  setInputAmount,
  balance,
}) => {
  const currency = useRecoilValue(currencyAtom);
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });
  const price = getAmountByPrice(inputAmount, currency, fromToken, assetPrices);

  return (
    <Box flex="1" minH="120px">
      <Text fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }}>
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
            Available {microamountToAmount(balance.amount, fromToken.decimals)} {getDenom(fromToken)}
          </Text>
          <Button
            variant="ghost"
            fontSize="xs"
            textTransform="uppercase"
            size="xs"
            onClick={() => setInputAmount(microamountToAmount(balance.amount, fromToken.decimals))}
          >
            Max
          </Button>
          <Button
            variant="ghost"
            fontSize="xs"
            textTransform="uppercase"
            size="xs"
            onClick={() =>
              setInputAmount(microamountToAmount(Number(balance.amount) / 2, fromToken.decimals))
            }
          >
            Half
          </Button>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <AssetSelector
            selectedAsset={fromToken}
            setAsset={setFromToken}
            hiddenTokens={[toToken.name.toLowerCase(), fromToken.name.toLowerCase()]}
          />
          <Flex flexFlow="column" position="relative">
            <Flex alignItems="center" gap="0.5rem">
              <Input
                textAlign="right"
                border="none"
                _focus={{ bg: "whiteAlpha.200" }}
                _focus-visible={{ borderColor: "none", boxShadow: "none" }}
                _hover={{ bg: "whiteAlpha.200" }}
                p="0.2rem"
                bg="whiteAlpha.100"
                type="number"
                onChange={({ target }) => setInputAmount(target.value)}
                value={inputAmount}
              />
              <Text textTransform="uppercase">{getDenom(fromToken)}</Text>
            </Flex>
            <Text position="absolute" right="0" bottom="-6px" fontSize="xs" color="wynd.neutral.500">
              ≈ {formatCurrency(currency, `${price.toFixed(6)}`)}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default FromToken;
