import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const LsdSingleHeader = () => {
  return (
    <Box bg="url(/trippy2.png)" pt={36} rounded="lg" bgPosition="center" bgSize="cover">
      <Flex
        mb={12}
        py={3}
        bg="rgba(16, 11, 22,0.8)"
        w="full"
        h="full"
        flexFlow="column"
        gap="10"
        roundedTop="lg"
      >
        <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
          LSD $JUNO
        </Heading>
      </Flex>
      <Flex
        bg="rgba(16, 11, 22,0.9)"
        gap={6}
        px={3}
        py={2}
        justifyContent={"space-around"}
        borderBottomRadius="lg"
        flexWrap="wrap"
      >
        <Box>
          <Text
            fontWeight="semibold"
            color="wynd.gray.500"
            fontSize="xs"
            textTransform="uppercase"
            textAlign="center"
          >
            Tokens staked
          </Text>
          <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
            @TODO
          </Text>
        </Box>
        <Box>
          <Text
            fontWeight="semibold"
            color="wynd.gray.500"
            fontSize="xs"
            textTransform="uppercase"
            textAlign="center"
          >
            Total TVL
          </Text>
          <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
             @TODO
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
