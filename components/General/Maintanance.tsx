import { Alert, AlertIcon, Box, Flex, Image, Text } from "@chakra-ui/react";

export default function Maintanance() {
  return (
    <>
      <style>
        {`body {
                margin:0!important
            }`}
      </style>
      <Flex
        bgColor={"#131222"}
        p={0}
        width={"100%"}
        height={"100vh"}
        alignItems={"center"}
        flexDirection={"column"}
        justifyContent={"top"}
      >
        <Box
          position="relative"
          background="linear-gradient(to bottom, transparent 0%, rgba(19,18,34,1) 95%, rgba(19,18,34,1) 100%), url('/druid.gif')"
          h="512px"
          w="512px"
        />
        <Flex flexDir="column">
          <p style={{ fontFamily: "Barlow", fontSize: "2em" }}>
            The website is currently in maintenance mode. <br />
          </p>
          <p style={{ fontFamily: "Barlow", fontSize: "1em" }}>
            All funds are safe, this is only a UI update. Please follow us on{" "}
            <a target="_blank" rel="noreferrer" href="https://twitter.com/wynddao">
              Twitter
            </a>{" "}
            to stay updated.
          </p>
        </Flex>
      </Flex>
    </>
  );
}
