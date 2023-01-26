import { Box, Flex, Text } from "@chakra-ui/react";
import { BorderedBox } from "./BorderedBox";

export const Unstaked = () => {
  return (
    <BorderedBox>
      <Flex justifyContent={"space-between"}>
        <Text fontSize="xl" fontWeight="bold" my={4} color="wynd.green.500" display="inline-block">
          Unstaked Tokens
        </Text>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mt={4} color="wynd.green.500" display="inline-block">
            1,567886 $WYND
          </Text>
          <Text>Stake these to increase your voting power.</Text>
        </Box>
      </Flex>
    </BorderedBox>
  );
};
