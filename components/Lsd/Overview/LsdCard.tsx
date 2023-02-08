import { Box, Divider, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import Link from "next/link";
import { WYND_TOKEN_ADDRESS } from "../../../utils";
import AssetImage from "../../Dex/AssetImage";

export const LsdCard = () => {
  function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  return (
    <Link href="#">
      <Flex
        borderRadius="lg"
        border="1px solid"
        borderColor={"wynd.neutral.100"}
        boxShadow="md"
        _hover={{
          cursor: "pointer",
          borderColor: "wynd.cyan.500",
          filter: "brightness(115%) hue-rotate(270deg)",
        }}
        backgroundColor={"wynd.gray.alpha.10"}
        backgroundImage={randomIntFromInterval(1, 2) === 1 ? "url(/trippy_bg_2.png)" : "url(/trippy_bg.png)"}
        backgroundPosition="right top"
        bgRepeat="no-repeat"
        p={4}
        flexFlow="column"
        justifyContent="space-between"
      >
        <Flex align="center" mb={4}>
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
        </Flex>
        <Grid templateColumns={"1fr 1fr"} gap={{ base: 2, md: 4 }}>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              APR
            </Text>
            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold" wordBreak="break-word">
              1
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              TVL
            </Text>
            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
              1
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Divider borderColor={"wynd.cyan.300"} />
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              Total Liquidity
            </Text>

            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
              1
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              My Shares
            </Text>
            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
              1
            </Text>
          </GridItem>
        </Grid>
      </Flex>
    </Link>
  );
};
