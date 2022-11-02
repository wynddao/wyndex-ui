"use client";

import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";

export default function GreetingMsg() {
  return (
    <Container maxW={"3xl"}>
      <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
        <Heading fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
          Test page for <br />
          <Text as={"span"} color={"green.400"}>
            WynDex UI
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          This will be the initial dashboard from which to go to Swap, Pools, and more
        </Text>
      </Stack>
    </Container>
  );
}
