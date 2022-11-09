import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Flex,
  Icon,
  Switch,
  Text,
  Tooltip,
  useClipboard,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Coin } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiBarChart,
  FiCopy,
  FiCreditCard,
  FiMoon,
  FiPackage,
  FiPieChart,
  FiRefreshCw,
  FiSun,
  FiUsers,
} from "react-icons/fi";
import { VscDebugDisconnect } from "react-icons/vsc";
import { LinkItemProps } from ".";
import wyndLogoBlack from "../../public/logo-black.svg";
import wyndLogoWhite from "../../public/logo-white.svg";
import NavItem from "./NavItem";

const LinkItems: readonly LinkItemProps[] = [
  { name: "Dashboard", to: "/", icon: FiActivity },
  { name: "Swap", to: "/swap", icon: FiRefreshCw },
  { name: "Pools", to: "/pools", icon: FiPieChart },
  { name: "Derivative Staking", to: "/derivative-staking", icon: FiBarChart },
  { name: "Governance", to: "https://app.wynddao.com", icon: FiUsers },
];

interface SidebarContentProps extends BoxProps {
  readonly onClose: () => void;
}

export default function SidebarContent({ onClose, ...restProps }: SidebarContentProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const walletManager = useWallet();

  const {
    address,
    openView,
    setCurrentChain,
    isWalletConnected,
    username,
    getStargateClient,
    disconnect,
    getChainRecord,
  } = walletManager;

  const { onCopy, hasCopied } = useClipboard(address || "");

  console.log({ address });

  const [balance, setBalance] = useState<Coin>();

  useEffect(() => {
    setCurrentChain("junotestnet");
    console.log({ chain: getChainRecord("junotestnet") });
  }, []);

  // TODO: use recoil hook instead of this
  useEffect(() => {
    (async function () {
      if (!isWalletConnected || !address) return;

      const client = await getStargateClient();
      if (!client) return;
      const denom = getChainRecord("junotestnet")?.assetList?.assets[0].base;
      if (!denom) return;
      const balance = await client.getBalance(address, denom);
      setBalance(balance);
    })();
  }, [isWalletConnected, address]);

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: "auto" }}
      pos="fixed"
      h="full"
      {...restProps}
    >
      <Box>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image
            alt="Wynd logo"
            src={useColorModeValue(wyndLogoBlack, wyndLogoWhite)}
            sizes="100vw"
            style={{ width: "100%", height: "auto", maxWidth: 128, maxHeight: 38 }}
          />
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} to={link.to} icon={link.icon} name={link.name} />
        ))}
        <Flex
          align="center"
          p={{ base: "2", lg: "4" }}
          mx={{ base: "2", lg: "4" }}
          borderRadius="lg"
          role="group"
          fontSize={{ base: "14", lg: "16" }}
          cursor="pointer"
          _hover={{
            bg: useColorModeValue("brand.cyan.100", "brand.blue.800"),
            color: "white",
          }}
          {...restProps}
        >
          <Icon
            mr="4"
            fontSize="0.8em"
            _groupHover={{
              color: "white",
            }}
            as={FiPackage}
          />
          Mistery Box
        </Flex>
      </Box>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={{ base: 1, lg: 2 }}
        m={{ base: "4", lg: "8" }}
      >
        <Flex alignItems="center" justifyContent="center" gap={4} m={{ base: "4", lg: "8" }}>
          <Icon
            fontSize={{ base: "md", lg: "lg" }}
            as={FiMoon}
            sx={{ color: useColorModeValue("inherit", "yellow.400") }}
          />
          <Switch
            isChecked={colorMode === "light"}
            onChange={() => toggleColorMode()}
            size={{ base: "md", lg: "lg" }}
          />
          <Icon
            fontSize={{ base: "md", lg: "lg" }}
            as={FiSun}
            sx={{ color: useColorModeValue("orange.500", "inherit") }}
          />
        </Flex>
        {isWalletConnected && balance ? (
          <Button as={Box} pr={0} w="full" h="auto">
            <Flex alignItems="center" justifyContent="space-between" gap={2} w="full">
              <Icon
                fontSize="1.25em"
                _groupHover={{
                  color: "white",
                }}
                as={FiCreditCard}
              />
              <Box>
                <Text>{username}</Text>
                <Text>
                  {balance.amount} {balance.denom}
                </Text>
              </Box>
              <Flex direction="column">
                <Tooltip label={hasCopied ? "Copied!" : "Copy wallet address"}>
                  <Button onClick={onCopy} sx={{ padding: 0 }} size="xs">
                    <Icon
                      fontSize="1em"
                      _groupHover={{
                        color: "white",
                      }}
                      as={FiCopy}
                    />
                  </Button>
                </Tooltip>
                <Tooltip label="Disconnect wallet">
                  <Button onClick={disconnect} sx={{ padding: 0 }} size="xs">
                    <Icon
                      fontSize="1em"
                      _groupHover={{
                        color: "white",
                      }}
                      as={VscDebugDisconnect}
                    />
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
          </Button>
        ) : (
          <Button onClick={openView} w="full">
            <Flex alignItems="center" justifyContent="space-around" w="full">
              <Icon
                fontSize="1.25em"
                _groupHover={{
                  color: "white",
                }}
                as={FiCreditCard}
              />
              <Text>Connect wallet</Text>
            </Flex>
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
