import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Head from "next/head";
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
        <title>WYND | DAO - ETH Denver</title>
      </Head>
      <Box margin={{ sm: 4, md: 8, lg: 16 }}>
        <Card maxW="100ch" marginInline="auto">
          <CardHeader>
            <Heading size="md">Welcome to the Cosmos ecosystem!</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Text fontSize="lg">
                  You can connect your wallet by installing one of the following wallets
                </Text>
                <UnorderedList mt={2}>
                  <ListItem>
                    <Link href="https://www.keplr.app/download" target="_blank" rel="noreferrer" sx={linkSx}>
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
              </Box>
              <Box>
                {address ? (
                  <Text fontSize="xl">Connected to {currentWalletName}!</Text>
                ) : (
                  <Text fontSize="xl">Connect your wallet with the chosen extension</Text>
                )}
                <Box width="fit-content" mt={2}>
                  <ConnectWalletButton />
                </Box>
              </Box>
              <Box>
                <Text fontSize="xl">Get some Cosmos tokens</Text>
                <Text fontSize="lg" mt={2}>
                  You can{" "}
                  <Link href="/convert" sx={linkSx}>
                    Convert
                  </Link>{" "}
                  your EVM tokens into Cosmos ones, or you can buy some with fiat using{" "}
                  <Link onClick={onOpen} sx={linkSx}>
                    Kado
                  </Link>
                  .
                </Text>
              </Box>
              <Box>
                <Text fontSize="xl">Deposit your tokens on the Juno network</Text>
                <Text fontSize="lg" mt={2}>
                  Your Cosmos tokens need to be deposited on the Juno network in order to operate with them on
                  this app. You can do that from the{" "}
                  <Link href="/" sx={linkSx}>
                    Dashboard
                  </Link>
                  .
                </Text>
              </Box>
              <Box>
                <Text fontSize="xl">Trade for other Cosmos tokens</Text>
                <Text fontSize="lg" mt={2}>
                  Now that you have some tokens on the Juno network, you can freely{" "}
                  <Link href="/swap" sx={linkSx}>
                    Swap
                  </Link>{" "}
                  them.
                </Text>
              </Box>
              <Box>
                <Text fontSize="xl">Earn rewards</Text>
                <Text fontSize="lg" mt={2}>
                  Once you have two tokens on the Juno network, you can find its associated pool in{" "}
                  <Link href="/pools" sx={linkSx}>
                    Pools
                  </Link>{" "}
                  and bond some tokens so that you can start WYNNING!
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Box>
      <OnRampModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
