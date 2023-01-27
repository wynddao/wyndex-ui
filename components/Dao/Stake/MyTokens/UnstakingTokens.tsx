import { Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useToast, WyndexStakeHooks } from "../../../../state";
import { Claim } from "../../../../state/clients/types/WyndDaoStake.types";
import { useDaoStakingInfos } from "../../../../state/hooks/useDaoStakingInfos";
import { useStakeInfos } from "../../../../state/hooks/useStakeInfos";
import { microamountToAmount } from "../../../../utils/tokens";

interface UnstakingTokensProps {
  stakeAddress: string;
  claims?: Claim[];
  claimsPending?: Claim[];
  claimsAvailable?: Claim[];
  walletAddress: string;
}

export const UnstakingTokens = (props: UnstakingTokensProps) => {
  const { claimsPending, claimsAvailable, stakeAddress, walletAddress } = props;
  const { txToast } = useToast();
  const doClaim = WyndexStakeHooks.useClaim({
    contractAddress: stakeAddress,
    sender: walletAddress,
  });
  const claim = async () => {
    await txToast(doClaim);
    // New balances will not appear until the next block.
    await new Promise((resolve) => setTimeout(resolve, 6500));
  };
  return (
    <>
      {claimsAvailable && claimsAvailable?.length > 0 && (
        <Flex justifyContent={"end"}>
          <Button variant={"ghost"} onClick={() => claim()}>
            Claim all
          </Button>
        </Flex>
      )}
      <Grid
        display="grid"
        templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr" }}
        columnGap={{ base: 2, lg: 4 }}
        fontSize="xs"
        fontWeight="semibold"
        color={"wynd.neutral.900"}
        py={2}
        px={4}
        bg="whiteAlpha.100"
      >
        <GridItem>Stakes</GridItem>
        <GridItem textAlign="end">Unlocks</GridItem>
      </Grid>
      {[...(claimsAvailable || []), ...(claimsPending || [])].map((claim, i) => (
        <Grid
          key={i}
          templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr" }}
          fontWeight="semibold"
          alignItems="center"
          backgroundImage={"url(/images/Vector2Bg.png)"}
          backgroundAttachment="fixed"
          backgroundPosition="bottom"
          borderBottom="1px solid var(--chakra-colors-chakra-border-color)"
          py="4"
          px="2"
          gap="4"
        >
          <GridItem display="flex" alignItems="center" gap={{ base: "2", lg: "4" }}>
            {microamountToAmount(claim.amount, 6)} $WYND
          </GridItem>
          <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">
              {/* @ts-ignore */}
              {new Date(Number(claim.release_at.at_time) / 1000000).toLocaleDateString()} {/* @ts-ignore */}
              {new Date(Number(claim.release_at.at_time) / 1000000).toLocaleTimeString()}
            </Text>
          </GridItem>
        </Grid>
      ))}
    </>
  );
};