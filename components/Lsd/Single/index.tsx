import { Text, Flex, Heading, Box, Grid, GridItem, Button, Input } from "@chakra-ui/react";
import { BorderedBox } from "../../Dao/Stake/MyTokens/BorderedBox";
import { LsdSingleHeader } from "./LSDHeader";

export const LsdSingle = ({ id }: { id: string }) => {
  return (
    <>
      <LsdSingleHeader />
      <Grid mt={4} templateColumns="1fr 1fr 1fr 1fr 1fr" gap={8}>
        <GridItem colStart={2}>
          <BorderedBox py={10}>
            <Flex justifyContent={"space-between"} flexDir="column" alignItems="center">
              <Text fontSize="md" fontWeight="semibold" display="inline-block">
                Your staked amount
              </Text>
              <Box>
                <Text fontSize="xl" fontWeight="bold" color="wynd.cyan.500" display="inline-block">
                  234.03 $wyJUNO
                </Text>
              </Box>
            </Flex>
          </BorderedBox>
        </GridItem>
        <BorderedBox py={10}>
          <Flex justifyContent={"space-between"} flexDir="column" alignItems="center">
            <Text fontSize="md" fontWeight="semibold" display="inline-block">
              Available to stake
            </Text>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
                0.8468 $JUNO
              </Text>
            </Box>
          </Flex>
        </BorderedBox>
        <BorderedBox py={10}>
          <Flex justifyContent={"space-between"} flexDir="column" alignItems="center">
            <Text fontSize="md" fontWeight="semibold" display="inline-block">
              Current APR
            </Text>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="wynd.purple.400" display="inline-block">
                5.04%
              </Text>
            </Box>
          </Flex>
        </BorderedBox>
      </Grid>
      <Grid templateColumns="1fr 1fr 1fr" mt={8} gap={8}>
        <GridItem colStart={2}>
          <BorderedBox bgImageActive={true} mb={8}>
            <Grid templateColumns="1fr 2fr">
              <Flex alignItems="center" justifyContent="center">
                <Text fontSize="xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
                  Stake now
                </Text>
              </Flex>
              <GridItem my={3}>
                <Flex justifyContent="end">
                  <Flex gap="0.5rem" alignSelf="end" alignItems="center" justifyContent="center">
                    <Text color="wynd.neutral.500" textTransform="uppercase" fontSize="xs">
                      Available 1 $JUNO
                    </Text>
                    <Button variant="ghost" fontSize="xs" textTransform="uppercase" size="xs">
                      Max
                    </Button>
                    <Button variant="ghost" fontSize="xs" textTransform="uppercase" size="xs">
                      Half
                    </Button>
                  </Flex>
                </Flex>
                <Flex justifyContent="end">
                  <Flex alignItems="center" gap="0.5rem">
                    <Flex position="relative">
                      <Input
                        textAlign="right"
                        border="none"
                        _focus={{ bg: "whiteAlpha.200" }}
                        _focus-visible={{ borderColor: "none", boxShadow: "none" }}
                        _hover={{ bg: "whiteAlpha.200" }}
                        p="0.2rem"
                        bg="whiteAlpha.100"
                        type="number"
                      />
                      <Text
                        position="absolute"
                        right="0"
                        bottom="-4"
                        fontSize="10px"
                        color="wynd.neutral.500"
                      >
                        ≈ 1 $
                      </Text>
                    </Flex>
                    <Text textTransform="uppercase" minW="55px">
                      $JUNO
                    </Text>
                  </Flex>
                </Flex>
              </GridItem>
            </Grid>
          </BorderedBox>
          <Flex
            bg="whiteAlpha.100"
            backdropFilter="blur(5px)"
            borderRadius="xl"
            p={6}
            maxW={{ lg: "600px" }}
            minW={{ lg: "600px" }}
            margin={{ lg: "0 auto" }}
            border="0"
            flexFlow="column"
            gap="1rem"
            alignItems="center"
          >
            <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
              <Text color={"wynd.neutral.500"}>You will recieve</Text>
              <Text>
                <Text as="span" textTransform="uppercase" fontSize="sm" color="wynd.gray.600">
                  1
                </Text>
              </Text>
            </Flex>
            <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
              <Text color={"wynd.neutral.500"}>Exchange rate</Text>
              <Text>1</Text>
            </Flex>
            <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
              <Text color={"wynd.neutral.500"}>Reward Fee</Text>
              <Text>1</Text>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};
