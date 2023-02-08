import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const LsdHeader = () => {
  return (
    <Box bg="url(/trippy.png)" rounded="lg" bgPosition="center" bgSize="cover">
      <Flex
        bg="rgba(16, 11, 22,0.6)"
        w="full"
        h="full"
        px={{ base: "4", md: "8" }}
        py={{ base: "6", md: "12" }}
        flexFlow="column"
        gap="10"
        roundedTop="lg"
      >
        <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
          Liquid Staking Derivatives
        </Heading>
        <Flex gap={6} justifyContent={"space-around"} flexFlow={{ base: "column", md: "row" }}>
          <Box py={{ md: 2 }} textAlign={{ base: "center", md: "left" }}>
            <Text fontWeight="semibold" color="wynd.gray.500">
              TODO
            </Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
              TODO
            </Text>
          </Box>
          <Box py={{ md: 2 }} textAlign={{ base: "center", md: "right" }}>
            <Text fontWeight="semibold" color="wynd.gray.500">
              TODO
            </Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
              TODO
            </Text>
          </Box>
        </Flex>
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
            TODO
          </Text>
          <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
            TODO
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
