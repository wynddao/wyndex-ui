import { Box, Button, Skeleton, Text } from "@chakra-ui/react";
import { ExecuteResult } from "cosmwasm";
import { useToast, WyndexStakeHooks } from "../../../state";
import { useStakeInfos } from "../../../state/hooks/useStakeInfos";
import { getNativeIbcTokenDenom } from "../../../utils/assets";
import { microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import { assetList } from "@wynddao/asset-list";
import TokenName from "../TokenName";
import { Suspense } from "react";
import { useTranslation } from "i18next-ssg";
export const Rewards = ({ address, stakingContract }: { address: string; stakingContract: string }) => {
  const { rewards, refreshPendingUnstaking, refreshRewards } = useStakeInfos(stakingContract, true);
  const { txToast } = useToast();
  let hasRewards = false;
  if (rewards) {
    let total = 0;
    rewards.map((reward) => {
      total += Number(reward.amount);
    });
    if (total > 0) {
      hasRewards = true;
    }
  }

  const doWithdraw = WyndexStakeHooks.useWithdraw({
    contractAddress: stakingContract,
    sender: address,
  });

  const withdraw = async () => {
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doWithdraw({});

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshPendingUnstaking();
      refreshRewards();
      return result;
    });
  };
  const { t } = useTranslation("common");
  return (
    <>
      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4} color="wynd.green.500" display="inline-block">
          {t("pool.myRewards")}
        </Text>
        <Suspense fallback={<Skeleton height={4} />}>
          {hasRewards && (
            <Button
              fontSize="sm"
              onClick={() => withdraw()}
              bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
              marginLeft={40}
              _hover={{
                bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
              }}
            >
              {t("pool.action.claim")}
            </Button>
          )}
        </Suspense>
        <Suspense fallback={<Skeleton height={4} />}>
          <Box display={"flex"}>
            {!hasRewards && <Text> {t("pool.youCurrentlyHaveNoRewards")}</Text>}
            <Box>
              {hasRewards &&
                rewards &&
                rewards.map((reward, i) => {
                  if (Number(reward.amount) > 0) {
                    let decimals = 6;
                    if (reward.info.hasOwnProperty("native")) {
                      decimals =
                        assetList.tokens.find(
                          // @ts-ignore
                          (el) => el.denom === reward.info.native || el.juno_denom === reward.info.native,
                        )?.decimals || 6;
                    } else {
                      // @ts-ignore
                      decimals = assetList.tokens.find((el) => el.denom === reward.info.token)?.decimals || 6;
                    }
                    return (
                      <Box key={i}>
                        {reward.info.hasOwnProperty("native") ? (
                          <span>
                            {microamountToAmount(reward.amount, decimals)} {/* @ts-ignore */}
                            {microdenomToDenom(getNativeIbcTokenDenom(reward.info.native))}
                          </span>
                        ) : (
                          <span>
                            {microamountToAmount(reward.amount, decimals)} {/* @ts-ignore */}
                            <TokenName symbol={true} address={reward.info.token} />
                          </span>
                        )}
                      </Box>
                    );
                  }
                })}
            </Box>
          </Box>
        </Suspense>
      </Box>
    </>
  );
};
