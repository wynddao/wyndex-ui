import { Box, Flex, Text } from "@chakra-ui/react";
import { microamountToAmount } from "../../../../utils/tokens";

export const VestedTokens = ({
  vestedBalance,
  walletStakedTokens,
  unstakedAmount,
}: {
  vestedBalance: string;
  walletStakedTokens: number;
  unstakedAmount: number;
}) => {
  const totalBalance = walletStakedTokens + unstakedAmount;
  return (
    <>
      <Flex justifyContent={"space-around"} my={4}>
        <Text fontSize="xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
          Locked due vesting:
        </Text>
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
            {microamountToAmount(vestedBalance, 6)} $WYND
          </Text>
          <Text fontSize="small">({(100 / totalBalance * Number(vestedBalance)).toFixed(2)}% of your total balance)</Text>
        </Box>
      </Flex>
    </>
  );
};
