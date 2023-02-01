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
    <Box bg="url(/moonforest.png)" rounded="lg" bgPosition="center" bgSize="cover">
      <Flex
        bg="rgba(16, 11, 22,0.8)"
        w="full"
        h="full"
        px={{ base: "4", md: "8" }}
        py={{ base: "6", md: "12" }}
        flexFlow="column"
        gap="10"
        rounded="lg"
      >
        <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
          Stake
        </Heading>
        <Flex gap={6} justifyContent={"space-around"} flexFlow={{ base: "column", md: "row" }}>
          <Box py={{ md: 2 }} textAlign={{ base: "center", md: "left" }}>
            <Text fontWeight="semibold" color="wynd.gray.500">
              DAO Treasury
            </Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
              {Number(microamountToAmount(treasuryBalance || 0, 6)).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              $WYND
            </Text>
          </Box>
          <Box py={{ md: 2 }} textAlign={{ base: "center", md: "right" }}>
            <Text fontWeight="semibold" color="wynd.gray.500">
              Total staked
            </Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
              {Number(microamountToAmount(totalStaked || 0, 6)).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              $WYND
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
