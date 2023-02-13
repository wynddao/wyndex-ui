import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const LsdHeader = () => {
  return (
    <Box bg="url(/trippy.png)" pt={"60px"} rounded="lg" bgPosition="center" bgSize="cover">
      <Flex
        w="full"
        h="full"
        bg="rgba(16, 11, 22,0.5)"
        py={6}
        mb={"60px"}
        flexFlow="column"
        gap="10"
        roundedTop="lg"
      >
        <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
          Liquid Staking Derivatives
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
            My LSD Assets
          </Text>
          <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
            0$
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
            Total LSD Assets
          </Text>
          <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
            0$
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
