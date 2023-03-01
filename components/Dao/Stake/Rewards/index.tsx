import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ExecuteResult } from "cosmwasm";
import { useRecoilValue } from "recoil";
import { useIndexerInfos, useToast, WyndexStakeHooks } from "../../../../state";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { DAO_STAKING_ADDRESS, WYND_TOKEN_ADDRESS } from "../../../../utils";
import { microamountToAmount } from "../../../../utils/tokens";
import { BorderedBox } from "../MyTokens/BorderedBox";

export const Rewards = ({
  rewards: rewardsWynd,
  address,
}: {
  rewards: number | undefined;
  address: string | undefined;
}) => {
  const { txToast } = useToast();
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);

  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice =
    currency === "USD" ? wyndexAssetPrice?.priceInUsd ?? 0 : wyndexAssetPrice?.priceInEur ?? 0;

  const rewardsFiat = Number(rewardsWynd) * wyndexPrice;
  const rewardsWyndFormatted = Number(microamountToAmount(rewardsWynd || 0, 6)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
  const rewardsFiatFormatted = Number(microamountToAmount(rewardsFiat, 6, 2)).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  const doWithdraw = WyndexStakeHooks.useWithdraw({
    contractAddress: DAO_STAKING_ADDRESS,
    sender: address || "",
  });

  const claim = async () => {
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doWithdraw({});

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      return result;
    });
  };

  return (
    <Box mt="8">
      <BorderedBox bgImageActive={false}>
        <Flex gap={4} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="xl" fontWeight="bold">
            Rewards:{" "}
            <strong>
              {rewardsWyndFormatted} $WYND (~{rewardsFiatFormatted} {currency === "USD" ? "$" : "€"})
            </strong>
          </Text>
          <Button onClick={() => claim()}>Claim!</Button>
        </Flex>
      </BorderedBox>
    </Box>
  );
};
