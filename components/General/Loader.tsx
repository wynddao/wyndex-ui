"use client";
import { Box, Flex } from "@chakra-ui/react";

export default function Loader() {
  return (
    <>
      <style>
        {`body {
                margin:0!important
            }`}
      </style>
      <Flex
        bgColor={"#0b2b26"}
        p={0}
        width={"100%"}
        height={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box
          position="relative"
          background="linear-gradient(to bottom, transparent 0%, #0b2b26 95%, #0b2b26 100%), url('/druid.gif')"
          h="512px"
          w="512px"
        />
      </Flex>
    </>
  );
}
