import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";

export const GaugeHeader = ({ gauge }: { gauge: GaugeResponse }) => {
  const router = useRouter();
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
            # {gauge.id}
          </Heading>
          <Text fontSize={{ base: "2xl", md: "2xl" }} fontWeight="bold">
            {gauge.title}
          </Text>
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
  );
};
