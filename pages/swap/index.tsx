"use client";
import { Box, Flex } from "@chakra-ui/react";
import Swap from "../../components/Swap";

export default function Page() {
  return (
    <Flex
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
      bgImage={"/images/Vector.png"}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      bgPos="left"
      minH="100vh"
    >
      <Swap />
      <Box
        bgImage={"/flute.png"}
        bgRepeat={"no-repeat"}
        bgSize={"cover"}
        bgPos={"center"}
        position="absolute"
        h={{ xl: "400px", "2xl": "520px" }}
        w={{ xl: "260px", "2xl": "400px" }}
        bottom="0.5rem"
        right="0.5rem"
      />
    </Flex>
  );
}
