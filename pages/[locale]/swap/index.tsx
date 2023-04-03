import { Box, Flex } from "@chakra-ui/react";
import Head from "next/head";
import Swap from "../../../components/Dex/Swap";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND | DEX - Swap Tokens</title>
      </Head>
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
    </>
  );
}