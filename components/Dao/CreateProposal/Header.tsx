"use client";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const CreateProposalHeader = () => {
  return (
    <Box bg="url(/castle.jpeg)" position="relative" rounded="lg" bgPosition="bottom" bgSize="cover">
      <Box bg="rgba(16, 11, 22,0.8)" w="full" h="full">
        <Flex gap={6} px={8} py={4} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
          <Heading
            bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
            bgClip="text"
            display="inline"
            fontSize={{ base: "3xl", md: "6xl" }}
            pt="8"
          >
            Create Proposal
          </Heading>
          <Text fontSize={{ base: "2xl", md: "2xl" }} fontWeight="bold">
            Create a new proposal
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
