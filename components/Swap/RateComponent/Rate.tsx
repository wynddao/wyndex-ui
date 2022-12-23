import { Flex, Text } from "@chakra-ui/react";
import { SimulateSwapOperationsResponse } from "../../../state/clients/types/WyndexMultiHop.types";
import React, { useMemo } from "react";
import { Asset } from "@wynddao/asset-list";
import { microamountToAmount } from "../../../utils/tokens";
import { getAssetPriceByCurrency, getDenom } from "../../../utils/assets";
import { useRecoilValue } from "recoil";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { useIndexerInfos } from "../../../state";
import { formatCurrency } from "../../../utils/currency";
import SwapRoute from "./SwapRoute";

interface IProps {
  fromToken: Asset;
  toToken: Asset;
  simulatedOperation: SimulateSwapOperationsResponse;
  inputAmount: string;
  slippage: number;
  route: { from: string | undefined; to: string | undefined }[];
}

const Rate: React.FC<IProps> = ({ fromToken, toToken, simulatedOperation, inputAmount, slippage, route }) => {
  const minimumReceived = ((100 - slippage) / 100) * Number(simulatedOperation.amount);
  const currency = useRecoilValue(currencyAtom);
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });

  const totalFee = useMemo(
    () =>
      simulatedOperation.commission_amounts.reduce((acc, { amount, info }) => {
        const price = getAssetPriceByCurrency(currency, info, assetPrices);
        return acc + price * Number(amount);
      }, 0),
    [assetPrices, currency, simulatedOperation.commission_amounts],
  );

  const minSlippage = useMemo(
    () => (+Number(simulatedOperation.spread).toFixed(4) * 100).toFixed(2),
    [simulatedOperation.spread],
  );

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
          {inputAmount}{" "}
          <Text as="span" textTransform="uppercase" fontSize="sm" color="wynd.gray.600">
            {getDenom(fromToken)}
          </Text>{" "}
          ≈ {microamountToAmount(simulatedOperation.amount, toToken.decimals, 6)}{" "}
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
        <Text>{formatCurrency(currency, microamountToAmount(totalFee, fromToken.decimals, 6))}</Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Estimated Slippage</Text>
        <Text>{minSlippage} %</Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Minimum received amount</Text>
        <Text>{microamountToAmount(minimumReceived, toToken.decimals, 6)}</Text>
      </Flex>
    </Flex>
  );
};

export default Rate;
