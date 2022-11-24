"use client";
import { Box, Button, Flex, Heading, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getPairs } from "../../utils";
import { Pair } from "../../utils/types";
import CreatePoolModal from "../CreatePoolModal";
import { useWallet } from "@cosmos-kit/react";
import dynamic from "next/dynamic";
import PoolsCard from "./PoolsCard";

const CreatePoolModal = dynamic(() => import("../CreatePoolModal"));

export default function Pools() {

  const { onOpen, isOpen, onClose } = useDisclosure();
  const [data, setData] = useState<Pair[]>([]);

  const getAsync = async () => {
    const pairs = await getPairs();
    setData(pairs);
  };

  useEffect(() => {
    getAsync();
  }, []);

  return (
    <>
      <Flex p={4} flexDir="column" gap={2}>
        <Flex align="center" mb={6}>
          <Heading as="h2" fontSize="2xl" mr={4}>
            Active Pools
          </Heading>
          <Button
            onClick={isWalletConnected ? openCreatePool : openConnectWallet}
            display={{ base: "none", sm: "block" }}
          >
            Create New Pool
          </Button>
        </Flex>
        <Box bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} m={-4} px={4} py={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            My Pools
          </Text>
          <PoolsCard poolsData={data} />
        </Box>
      </Flex>
      <CreatePoolModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
