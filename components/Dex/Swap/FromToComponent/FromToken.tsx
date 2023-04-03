import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { Coin } from "cosmwasm";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../../state";
import { useLsdInfos } from "../../../../state/hooks/lsd/useLsdInfos";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { getAmountByPrice, getDenom } from "../../../../utils/assets";
import { formatCurrency } from "../../../../utils/currency";
import { microamountToAmount } from "../../../../utils/tokens";
import { lsdEntries } from "../../../Lsd/Overview";
import AssetSelector from "./AssetSelector";
import { useTranslation } from "i18next-ssg";

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
  let price = getAmountByPrice(inputAmount, currency, fromToken, assetPrices);
  const isJuno = fromToken.denom === "ujunox" || fromToken.denom === "ujuno";

  const { t } = useTranslation("common");


  const isWyJuno = fromToken.denom === "uwyjuno";

  const lsdEntry = lsdEntries.find((el) => el.id === Number(1))!;
  const lsdContract = lsdEntry.contractAddr;
  const { exchange_rate: wyJunoJunoExchangeRate } = useLsdInfos(lsdContract);
  const junoAssetPrice =
    currency === "USD"
      ? assetPrices.find((el) => el.asset === "ujuno")?.priceInUsd!
      : assetPrices.find((el) => el.asset === "ujuno")?.priceInEur;

  price = isWyJuno ? Number(junoAssetPrice) * Number(wyJunoJunoExchangeRate) * Number(inputAmount) : price;


  return (
    <Box flex="1" minH="120px">
      <Box
        p={4}
        borderRadius="lg"
        bg="wynd.base.sidebar"
        display="flex"
        flexFlow="column"
        className="swap-from"
      >
        <Flex justifyContent="space-between">
          <Text fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }}>
            {t("swap.from")}
          </Text>
          <Flex gap="0.5rem" alignSelf="end" alignItems="center" justifyContent="center">
            <Text color="wynd.neutral.500" textTransform="uppercase" fontSize="xs">
              {t("general.available")} {microamountToAmount(balance.amount, fromToken.decimals)}{" "}
              {getDenom(fromToken)}
            </Text>
            <Button
              variant="ghost"
              fontSize="xs"
              textTransform="uppercase"
              size="xs"
              onClick={() =>
                setInputAmount(
                  microamountToAmount(
                    isJuno ? Number(balance.amount) - 50000 : balance.amount,
                    fromToken.decimals,
                  ),
                )
              }
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
              {t("swap.half")}
            </Button>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <AssetSelector
            selectedAsset={fromToken}
            setAsset={setFromToken}
            hiddenTokens={[toToken.name.toLowerCase(), fromToken.name.toLowerCase()]}
          />
          <Flex flexFlow="column">
            <Flex alignItems="center" gap="0.5rem">
              <Flex position="relative">
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
                <Text position="absolute" right="0" bottom="-4" fontSize="10px" color="wynd.neutral.500">
                  ≈ {formatCurrency(currency, `${price.toFixed(6)}`)}
                </Text>
              </Flex>
              <Text textTransform="uppercase" minW="55px">
                {fromToken.symbol}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default FromToken;
