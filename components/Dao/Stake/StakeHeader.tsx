import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { microamountToAmount } from "../../../utils/tokens";

export const StakeHeader = ({
  totalStaked,
  treasuryBalance,
}: {
  totalStaked: string | undefined;
  treasuryBalance: string;
}) => {
  return (
    <Box bg="url(/castle3.png)" rounded="lg" bgPosition="0 -180px" bgSize="cover">
      <Box bg="rgba(16, 11, 22,0.8)" py={4} w="full" h="full">
        <Heading textAlign="center" fontSize={{ base: "3xl", md: "6xl" }}>Stake</Heading>
        <Flex gap={6} px={8} py={4} justifyContent={"space-around"}>
          <Box py={{ md: 2 }}>
            <Text fontWeight="semibold" opacity={0.7}>
              DAO Treasury
            </Text>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
              {Number(microamountToAmount(treasuryBalance || 0, 6)).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              $WYND
            </Text>
          </Box>
          <Box py={{ md: 2 }}>
            <Text fontWeight="semibold" opacity={0.7}>
              Total staked
            </Text>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
              {Number(microamountToAmount(totalStaked || 0, 6)).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              $WYND
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
