import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const LsdHeader = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="url(/trippy.png)"
      py={12}
      rounded="lg"
      bgPosition="center"
      bgSize="cover"
    >
      <Flex
        w="full"
        h="full"
        bg="rgba(16, 11, 22,0.5)"
        py={6}
        flexFlow="column"
        gap="10"
        roundedTop="lg"
        alignItems="center"
      >
        <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
          Liquid Staking Derivatives
        </Heading>
      </Flex>
    </Box>
  );
};
