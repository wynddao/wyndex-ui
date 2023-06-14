import { Flex, Text } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../../state";
import { SimulateSwapOperationsResponse } from "../../../../state/clients/types/WyndexMultiHop.types";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { getAssetPriceByCurrency, getDenom } from "../../../../utils/assets";
import { formatCurrency } from "../../../../utils/currency";
import { microamountToAmount } from "../../../../utils/tokens";
import SwapRoute from "./SwapRoute";

interface IProps {
  fromToken: Asset;
  toToken: Asset;
  inputFrom: string | null;
  inputTo: string | null;
  simulatedFrom: SimulateSwapOperationsResponse;
  simulatedTo: SimulateSwapOperationsResponse;
  slippage: number;
  route: { from: string | undefined; to: string | undefined }[];
}

const Rate: React.FC<IProps> = ({
  fromToken,
  toToken,
  inputFrom,
  inputTo,
  simulatedFrom,
  simulatedTo,
  slippage,
  route,
}) => {
  const simulatedOperation = inputFrom ? simulatedTo : simulatedFrom;
  const minimumReceived = ((100 - slippage) / 100) * Number(simulatedOperation.amount);
  const currency = useRecoilValue(currencyAtom);
  const { permlessAssets } = useIndexerInfos({});
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });
  const assetList = permlessAssets;

  const totalFee = simulatedOperation.commission_amounts.reduce((acc, { amount, info }) => {
    const price = getAssetPriceByCurrency(currency, info, assetPrices);
    const decimals =
      assetList.find((el) =>
        info.hasOwnProperty("native")
          ? // @ts-ignore
            el.denom === info.native || el.juno_denom === info.native
          : // @ts-ignore
            el.token_address === info.token,
      )?.decimals || 6;

    return acc + price * Number(microamountToAmount(amount, decimals));
  }, 0);

  const minSlippage = (Number(Number(simulatedOperation.spread).toFixed(4)) * 100).toFixed(2);

  return (
    <Flex
      bg="whiteAlpha.100"
      backdropFilter="blur(5px)"
      borderRadius="xl"
      p={6}
      maxW={{ lg: "600px" }}
      minW={{ lg: "600px" }}
      margin={{ lg: "0 auto" }}
      border="0"
      flexFlow="column"
      gap="1rem"
      alignItems="center"
    >
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Rate</Text>
        <Text>
          {inputFrom ?? microamountToAmount(simulatedOperation.amount, fromToken.decimals, 6)}{" "}
          <Text as="span" textTransform="uppercase" fontSize="sm" color="wynd.gray.600">
            {getDenom(fromToken)}
          </Text>{" "}
          ≈ {inputTo ?? microamountToAmount(simulatedOperation.amount, toToken.decimals, 6)}
          <Text as="span" textTransform="uppercase" fontSize="sm" color="wynd.gray.600">
            {getDenom(toToken)}
          </Text>
        </Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Swap Route</Text>
        <SwapRoute route={route} />
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Swap Fee</Text>
        <Text>{formatCurrency(currency, totalFee.toString())}</Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Spread</Text>
        <Text>{minSlippage} %</Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Minimum Received Amount</Text>
        <Text>{inputTo ?? microamountToAmount(minimumReceived, toToken.decimals, 6)}</Text>
      </Flex>
    </Flex>
  );
};

export default Rate;
