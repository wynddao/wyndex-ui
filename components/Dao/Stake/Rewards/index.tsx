import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ExecuteResult } from "cosmwasm";
import { useToast, WyndexStakeHooks } from "../../../../state";
import { DAO_STAKING_ADDRESS } from "../../../../utils";
import { microamountToAmount } from "../../../../utils/tokens";
import { BorderedBox } from "../MyTokens/BorderedBox";

export const Rewards = ({
  rewards,
  address,
}: {
  rewards: number | undefined;
  address: string | undefined;
}) => {
  const { txToast } = useToast();
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
      <BorderedBox bgImage={false}>
        <Flex gap={4} alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="xl" fontWeight="bold">
            Rewards: <strong>{microamountToAmount(rewards || 0, 6)} $WYND</strong>
          </Text>
          <Button onClick={() => claim()}>Claim!</Button>
        </Flex>
      </BorderedBox>
    </Box>
  );
};
