import { Box, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../../state";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { WYND_TOKEN_ADDRESS } from "../../../../utils";
import { formatCurrency } from "../../../../utils/currency";
import { microamountToAmount } from "../../../../utils/tokens";
import { BorderedBox } from "./BorderedBox";

export const VotingPower = ({
  walletStakedPower,
  totalStakedValue,
  walletStakedTokens,
}: {
  walletStakedTokens: number | undefined;
  walletStakedPower: number | undefined;
  totalStakedValue: number;
}) => {
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);

  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice =
    currency === "USD" ? wyndexAssetPrice?.priceInUsd ?? 0 : wyndexAssetPrice?.priceInEur ?? 0;

  return (
    <BorderedBox>
      <Flex justifyContent={"space-between"}>
        <Text fontSize="xl" fontWeight="bold" my={4} color="wynd.green.500" display="inline-block">
          Voting Power
        </Text>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mt={4} color="wynd.green.500" display="inline-block">
            {walletStakedPower} (
            {(totalStakedValue ? (Number(walletStakedPower) / totalStakedValue) * 100 : 0).toLocaleString(
              undefined,
              { maximumSignificantDigits: 4 },
            ) + "%"}
            )
          </Text>
          {Number(walletStakedTokens) > 0 && (
            <>
              <Text>{microamountToAmount(walletStakedTokens ?? 0, 6)} $WYND staked</Text>
              <Text fontSize="sm">
                {"≈ "}
                {formatCurrency(
                  currency,
                  (Number(microamountToAmount(walletStakedTokens || 0, 6)) * wyndexPrice).toString(),
                )}
              </Text>
            </>
          )}
        </Box>
      </Flex>
    </BorderedBox>
  );
};
