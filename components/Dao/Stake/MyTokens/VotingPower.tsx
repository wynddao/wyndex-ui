import { Box, Flex, Text } from "@chakra-ui/react";
import { useDaoStakingInfos } from "../../../../state/hooks/useDaoStakingInfos";
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
          {Number(walletStakedTokens) > 0 && <Text>{microamountToAmount(walletStakedTokens || 0, 6)} $WYND staked</Text>}
        </Box>
      </Flex>
    </BorderedBox>
  );
};
