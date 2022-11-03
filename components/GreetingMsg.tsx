"use client";

import { Box, Button, ButtonGroup, Center, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { myAddressAtom } from "../atoms";

export default function GreetingMsg() {
  const [myAddress, setMyAddress] = useRecoilState(myAddressAtom);

  return (
    <Container maxW={"3xl"}>
      <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 14 }} pt={{ base: 10, md: 18 }}>
        <Heading fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
          Test page for <br />
          <Text as={"span"} color={"brand.700"}>
            WynDex UI
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          This will be the initial dashboard from which to go to Swap, Pools, and more
        </Text>
        <Center>
          <ButtonGroup gap="4">
            <Button onClick={() => setMyAddress(Number(Math.random().toString().slice(-8)))}>
              Get an address
            </Button>
            <Button onClick={() => setMyAddress(null)}>Clear my address</Button>
          </ButtonGroup>
        </Center>
        <Text color={"gray.500"} fontFamily={"brand"}>
          {myAddress ? `Your address is ${myAddress}` : "You don't have an address yet"}
        </Text>
      </Stack>
    </Container>
  );
}
