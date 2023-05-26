"use client";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useChain, useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { secondsToDays, secondsToWdhms } from "../../../utils/time";
import AddOptionModal from "./OptionModal";

export const GaugeHeader = ({ gauge }: { gauge: GaugeResponse }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const { address: walletAddress } = useChain("juno");

  return (
    <>
      <Box bg="url(/castle.jpeg)" position="relative" rounded="lg" bgPosition="bottom" bgSize="cover">
        <Box bg="rgba(16, 11, 22,0.8)" w="full" h="full">
          <Flex
            gap={6}
            px={8}
            py={4}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Heading
              bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
              bgClip="text"
              display="inline"
              fontSize={{ base: "3xl", md: "6xl" }}
              pt="8"
            >
              # {gauge.id}
            </Heading>
            <Text fontSize={{ base: "2xl", md: "2xl" }} fontWeight="bold">
              {gauge.title}
            </Text>
          </Flex>
        </Box>
        <Box>
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
                Epoch length
              </Text>
              <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
                {/* @ts-ignore */}
                {secondsToDays(gauge.epoch_size)} Days
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
                Next epoch
              </Text>
              <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
                {/* @ts-ignore */}
                in {secondsToWdhms(gauge.next_epoch - Date.now() / 1000)}
              </Text>
            </Box>
            <Box>
              <Button
                isDisabled={!walletAddress || walletAddress.length === 0 ? true : false}
                onClick={() => setOpen(true)}
              >
                Add your project
              </Button>
            </Box>
          </Flex>
        </Box>
        <Button
          onClick={() => router.push(`/gauges`)}
          position="absolute"
          width="200px"
          height="100%"
          top="0"
          bgColor={"transparent"}
          bgGradient={"linear-gradient(90deg, rgba(113,204,152,0.5) 0%, rgba(0,0,0,0) 100%)"}
          _hover={{ bgColor: "transparent" }}
        >
          <BsChevronLeft /> Gauges Overview
        </Button>
      </Box>
      <AddOptionModal
        gauge={gauge}
        walletAddress={walletAddress as string}
        onClose={() => setOpen(false)}
        isOpen={open}
      />
    </>
  );
};
