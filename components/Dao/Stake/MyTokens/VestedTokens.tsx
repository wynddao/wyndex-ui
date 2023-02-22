import { Box, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../../state";
import { Claim } from "../../../../state/clients/types/WyndDaoStake.types";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { WYND_TOKEN_ADDRESS } from "../../../../utils";
import { microamountToAmount } from "../../../../utils/tokens";

export const VestedTokens = ({
  vestedBalance,
  walletStakedTokens,
  unstakedAmount,
  claims,
}: {
  vestedBalance: string;
  walletStakedTokens: number;
  unstakedAmount: number;
  claims?: Claim[];
}) => {
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);
  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice =
    currency === "USD" ? wyndexAssetPrice?.priceInUsd ?? 0 : wyndexAssetPrice?.priceInEur ?? 0;

  const claimSum = claims ? claims.reduce((acc, curr) => acc + Number(curr.amount) / 10 ** 6, 0) : 0;
  const totalBalance = walletStakedTokens + unstakedAmount + claimSum;

  return (
    <>
      <Flex justifyContent={"space-around"} my={4}>
        <Text fontSize="xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
          Locked due vesting:
        </Text>
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
            {microamountToAmount(vestedBalance, 6)} $WYND (~
            {microamountToAmount(Number(vestedBalance) * wyndexPrice, 6, 2)} {currency === "USD" ? "$" : "€"})
          </Text>
          <Text fontSize="small">
            ({((100 / totalBalance) * Number(vestedBalance)).toFixed(2)}% of your total balance)
          </Text>
        </Box>
      </Flex>
    </>
  );
};
