import { Box, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../../state";
import { Claim } from "../../../../state/clients/types/WyndDaoStake.types";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { WYND_TOKEN_ADDRESS } from "../../../../utils";
import { microamountToAmount } from "../../../../utils/tokens";
import { BorderedBox } from "./BorderedBox";

export const Unstaked = ({
  unstakedAmount,
  vestedBalance,
  walletStakedTokens,
  claims,
}: {
  unstakedAmount: number;
  vestedBalance: string;
  walletStakedTokens: number;
  claims?: Claim[];
}) => {
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);

  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice =
    currency === "USD" ? wyndexAssetPrice?.priceInUsd ?? 0 : wyndexAssetPrice?.priceInEur ?? 0;

  const claimSum = claims ? claims.reduce((acc, curr) => acc + Number(curr.amount) / 10 ** 6, 0) : 0;

  const availableAmount = Number(
    microamountToAmount(Number(unstakedAmount) + walletStakedTokens + claimSum - Number(vestedBalance), 6),
  );

  const _unstakedAmount = Number(microamountToAmount(unstakedAmount, 6) || 0);

  return (
    <BorderedBox>
      <Flex justifyContent={"space-between"}>
        <Text fontSize="xl" fontWeight="bold" my={4} color="wynd.green.500" display="inline-block">
          Unstaked Tokens
        </Text>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mt={4} color="wynd.green.500" display="inline-block">
            {microamountToAmount(unstakedAmount, 6) || 0} $WYND (~
            {microamountToAmount(unstakedAmount * wyndexPrice, 6, 2)} {currency === "USD" ? "$" : "€"})
          </Text>
          <Text fontSize="sm">
            Transferable: {availableAmount < 0 && "0"}
            {availableAmount > 0 && availableAmount < _unstakedAmount && availableAmount}
            {availableAmount > 0 && availableAmount > _unstakedAmount && _unstakedAmount} $WYND
          </Text>
        </Box>
      </Flex>
    </BorderedBox>
  );
};
