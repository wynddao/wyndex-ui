import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../../state";
import { useLsdInfos } from "../../../../state/hooks/lsd/useLsdInfos";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { getAmountByPrice } from "../../../../utils/assets";
import { formatCurrency } from "../../../../utils/currency";
import { lsdEntries } from "../../../Lsd/Overview";
import AssetSelector from "./AssetSelector";
import { useTranslation } from "i18next-ssg";
interface IProps {
  fromToken: Asset;
  toToken: Asset;
  setToToken: (asset: Asset) => void;
  fromAmount: string;
  inputAmount: string;
  setInputAmount: (amount: string) => void;
}

const ToToken: React.FC<IProps> = ({
  fromToken,
  toToken,
  setToToken,
  fromAmount,
  inputAmount,
  setInputAmount,
}) => {
  const currency = useRecoilValue(currencyAtom);
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });
  let priceFrom = getAmountByPrice(fromAmount, currency, fromToken, assetPrices);
  let priceTo = getAmountByPrice(inputAmount, currency, toToken, assetPrices);

  const isWyJuno = fromToken.denom === "uwyjuno";
  const isWyJunoTo = toToken.denom === "uwyjuno";

  const lsdEntry = lsdEntries.find((el) => el.id === Number(1))!;
  const lsdContract = lsdEntry.contractAddr;
  const { exchange_rate: wyJunoJunoExchangeRate } = useLsdInfos(lsdContract);
  const junoAssetPrice =
    currency === "USD"
      ? assetPrices.find((el) => el.asset === "ujuno")?.priceInUsd!
      : assetPrices.find((el) => el.asset === "ujuno")?.priceInEur;

  priceFrom = isWyJuno
    ? Number(junoAssetPrice) * Number(wyJunoJunoExchangeRate) * Number(fromAmount)
    : priceFrom;
  priceTo = isWyJunoTo
    ? Number(junoAssetPrice) * Number(wyJunoJunoExchangeRate) * Number(inputAmount)
    : priceTo;

  console.log(priceTo, priceFrom);

  const impact = 100 - (priceFrom / priceTo) * 100;
  const { t } = useTranslation("common");
  return (
    <Box flex="1">
      <Box
        p={4}
        borderRadius="lg"
        bg="wynd.base.sidebar"
        display="flex"
        flexFlow="column"
        className="swap-to"
        minHeight="120px"
        justifyContent="end"
      >
        <Text fontWeight="bold" fontSize={{ base: "lg", lg: "xl" }} textAlign="left">
          {t("swap.to")}
        </Text>
        <Flex justifyContent="space-between" alignItems="center">
          <AssetSelector selectedAsset={toToken} setAsset={setToToken} hiddenTokens={[fromToken, toToken]} />
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
                  ≈ {formatCurrency(currency, `${priceTo.toFixed(6)}`)} (
                  {isNaN(impact) || !isFinite(impact) ? "0" : impact.toFixed(2)} %)
                </Text>
              </Flex>
              <Text textTransform="uppercase" minW="55px">
                {toToken.symbol}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default ToToken;
