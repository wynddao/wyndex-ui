import { Box, Divider, Flex, Grid, GridItem, Progress, Text } from "@chakra-ui/react";
import Link from "next/link";
import { WYND_TOKEN_ADDRESS } from "../../../utils";
import AssetImage from "../../Dex/AssetImage";

export const LsdCard = () => {
  function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  return (
    <Box
      _hover={{
        cursor: "pointer",
        borderColor: "wynd.cyan.500",
      }}
      border="1px solid"
      borderColor={"wynd.neutral.100"}
      position="relative"
    >
      <Link href="#">
        <Flex
          borderRadius="lg"
          boxShadow="md"
          backgroundColor={"wynd.gray.alpha.10"}
          backgroundImage={
            randomIntFromInterval(1, 2) === 1 ? "url(/trippy_bg_2.png)" : "url(/trippy_bg.png)"
          }
          backgroundPosition="right top"
          bgRepeat="no-repeat"
          p={4}
          flexFlow="column"
          justifyContent="space-between"
        >
          <Flex mt={2} align="center" mb={4}>
            <Flex position="relative" align="center" pr={2}>
              <Box
                w={{ base: 12, md: 14, lg: 16 }}
                h={{ base: 12, md: 14, lg: 16 }}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor={"wynd.cyan.100"}
                overflow="hidden"
                p={0.5}
              >
                <AssetImage asset={WYND_TOKEN_ADDRESS} />
              </Box>
            </Flex>
            <Flex flexDirection="column" justify="center">
              <Text fontSize="xl" fontWeight="extrabold">
                Juno
              </Text>
              <Text fontWeight="bold" color={"wynd.neutral.600"} wordBreak="break-word"></Text>
            </Flex>
            <Box position="relative" ml={4} w={"100%"}>
              <Progress height={6} width={"100%"} bg={"wynd.gray.700"} colorScheme={"teal"} value={48} />
              <Text
                top={0}
                ml={2}
                position="absolute"
                bgGradient="linear(to-l, wynd.green.200, wynd.cyan.200)"
                bgClip="text"
                display="inline-block"
              >
                Unstaked: 48%
              </Text>
            </Box>
          </Flex>
          <Grid templateColumns={"1fr 1fr"} gap={{ base: 2, md: 4 }}>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                Tokens Staked
              </Text>
              <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
                1,000,000 $JUNO
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                TVL
              </Text>
              <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
                1,000,000 $JUNO
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Divider borderColor={"wynd.cyan.300"} />
            </GridItem>
          </Grid>
          <Grid templateColumns={"1fr 1fr"} gap={{ base: 2, md: 4 }}>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                MY STAKED TOKENS
              </Text>
              <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
                10,000 $JUNO
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                APR
              </Text>
              <Text
                bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
                bgClip="text"
                display="inline-block"
                fontSize={{ base: "md", sm: "lg" }}
                fontWeight="extrabold"
              >
                20%
              </Text>
            </GridItem>
          </Grid>
        </Flex>
      </Link>
    </Box>
  );
};
