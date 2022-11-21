"use client";
import { Box, Button, Flex, Heading, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import CreatePoolModal from "../CreatePoolModal";
import PoolsCard from "./PoolsCard";
import { getDefaultData } from "./__mocks__/pools";

export default function Pools() {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex p={4} flexDir="column" gap={2}>
        <Flex align="center" mb={6}>
          <Heading as="h2" fontSize="2xl" mr={4}>
            Active Pools
          </Heading>
          <Button onClick={onOpen} display={{ base: "none", sm: "block" }}>
            Create New Pool
          </Button>
        </Flex>
        <Box bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} m={-4} px={4} py={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            My Pools
          </Text>
          <PoolsCard poolsData={getDefaultData(4)} />
        </Box>
      </Flex>
      <CreatePoolModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
