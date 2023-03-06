import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Head from "next/head";
import { BorderedBox } from "../../components/Dao/Stake/MyTokens/BorderedBox";
import ConnectWalletButton from "../../components/General/Sidebar/ConnectWalletButton";
import OnRampModal from "../../components/General/Sidebar/OnRamp/OnRampModal";

const linkSx = {
  bgGradient: "linear(to-l, wynd.green.500, wynd.cyan.500)",
  bgClip: "text",
  fontWeight: "extrabold",
};

export default function Page() {
  const { address, currentWalletName } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>WYND | DAO - Welcome to the cosmos!</title>
      </Head>
      <Box margin={{ sm: 4, md: 8, lg: 16 }}>
        <Box bg="url(/cosmos.png)" rounded="lg" py={12} bgPosition="center" bgSize="cover">
          <Flex
            bg="rgba(16, 11, 22,0.7)"
            w="full"
            h="full"
            px={{ base: "4", md: "8" }}
            py={{ base: "6", md: "12" }}
            flexFlow="column"
            gap="10"
            roundedTop="lg"
          >
            <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
              Welcome to the CØSMOS Ecosystem!
            </Heading>
          </Flex>
        </Box>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <BorderedBox my={4} p={8} display="flex" alignItems="center">
            <Text fontSize="xl">
              Want to explore the Cosmos? The WYND ecosystem on Juno network is the perfect place to start!
              Below are instructions on how you can get started as a Cosmonaut!
            </Text>
          </BorderedBox>
          <BorderedBox my={4}>
            <Flex flexDir="column" alignItems="center" justifyContent="center">
              <Text fontSize="xl">You already know your way around?</Text>
              <Box mt={2}>
                <ConnectWalletButton />
              </Box>
            </Flex>
          </BorderedBox>
        </Grid>

        <BorderedBox>
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontSize="xl">Connect your wallet!</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box>
                  <Text fontSize="lg">
                    You can connect your wallet by installing one of the following wallets
                  </Text>
                  <UnorderedList mt={2}>
                    <ListItem>
                      <Link
                        href="https://www.keplr.app/download"
                        target="_blank"
                        rel="noreferrer"
                        sx={linkSx}
                      >
                        Keplr
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link
                        href="https://docs.cosmostation.io/docs/intro"
                        target="_blank"
                        rel="noreferrer"
                        sx={linkSx}
                      >
                        Cosmostation
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="https://www.leapwallet.io/" target="_blank" rel="noreferrer" sx={linkSx}>
                        Leap
                      </Link>
                    </ListItem>
                  </UnorderedList>
                  <Box mt={4}>
                    {address ? (
                      <Text fontSize="xl">Connected to {currentWalletName}!</Text>
                    ) : (
                      <Text fontSize="xl">Connect your wallet with the chosen extension</Text>
                    )}
                    <Box width="fit-content" mt={2}>
                      <ConnectWalletButton />
                    </Box>
                  </Box>
                </Box>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontSize="xl">Accumulate assets!</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text fontSize="lg" mt={2}>
                  You can{" "}
                  <Link href="/bridge" sx={linkSx}>
                    bridge
                  </Link>{" "}
                  your EVM tokens into Cosmos ones, or you can buy some with fiat using{" "}
                  <Link onClick={onOpen} sx={linkSx}>
                    Kado
                  </Link>
                  .
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontSize="xl">How do I deposit my tokens on the Juno network?</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text fontSize="lg" mt={2}>
                  Your Cosmos tokens need to be deposited on the Juno network in order to operate with them on
                  this app. You can do that from the{" "}
                  <Link href="/" sx={linkSx}>
                    Dashboard
                  </Link>{" "}
                  by clicking on &quot;IBC Deposit&quot;.
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontSize="xl">How do I trade assets?</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <Text fontSize="lg" mt={2}>
                  Now that you have some tokens on the Juno network, you can freely{" "}
                  <Link href="/swap" sx={linkSx}>
                    swap
                  </Link>{" "}
                  them.
                </Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontSize="xl">Earn rewards!</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <Box>
                  <Text fontSize="lg" mt={2}>
                    You can{" "}
                    <Link href="/stake" sx={linkSx}>
                      stake
                    </Link>{" "}
                    numerous tokens such as JUNO or WYND and earn additional tokens, or you can{" "}
                    <Link href="/pools" sx={linkSx}>
                      pool
                    </Link>{" "}
                    two tokens together and bond your liquidity to earn additional rewards. The longer you
                    bond your liquidity for, the greater the rewards.
                  </Text>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </BorderedBox>
        <BorderedBox mt={4} textAlign="center">
          <Text fontSize="2xl" mb={2}>
            Useful Links & Resources
          </Text>
          <Flex justifyContent="space-evenly" alignItems="center">
            <Box>
              <Link sx={linkSx} target="_blank" href="https://www.youtube.com/watch?v=Eb8xkDi_PUg">
                Cosmos YouTube Introduction
              </Link>
              <Text fontSize="sm">A short YouTube intro video about Cosmos</Text>
            </Box>
            <Box>
              <Link sx={linkSx} target="_blank" href="https://tendermint.com/">
                Core Technologies of Cosmos
              </Link>
              <Text fontSize="sm">Tendermint</Text>
            </Box>
            <Box>
              <Link sx={linkSx} target="_blank" href="https://cosmwasm.com/">
                CosmWasm
              </Link>
              <Text fontSize="sm">Smart contract platform</Text>
            </Box>
            <Box>
              <Link
                sx={linkSx}
                target="_blank"
                href="https://medium.com/wynddao/rebonding-has-arrived-74a21bc86017"
              >
                WYND Rebonding
              </Link>
              <Text fontSize="sm">{"WYND DAO's pioneering rebonding features"}</Text>
            </Box>
            <Box>
              <Link
                sx={linkSx}
                target="_blank"
                href="https://medium.com/wynddao/liquidity-gauges-on-wynd-dex-c886477848bc"
              >
                WYND Gauges
              </Link>
              <Text fontSize="sm">{"WYND DAO's innovative gauge vote system"}</Text>
            </Box>
            <Box>
              <Link
                sx={linkSx}
                target="_blank"
                href="https://medium.com/wynddao/lsd-on-wynd-dao-6afb16751889"
              >
                WYND LSD
              </Link>
              <Text fontSize="sm">WYND DAOs Liquid Staking Derivatives</Text>
            </Box>
          </Flex>
        </BorderedBox>
      </Box>
      <OnRampModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
