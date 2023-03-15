import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Coin } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { ExecuteResult, StdFee } from "cosmwasm";
import { startTransition, Suspense, useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { useToast } from "../../../state";
import { Claim } from "../../../state/clients/types/WyndLsdHub.types";
import { microamountToAmount } from "../../../utils/tokens";

const gaps = [25, 50, 75, 100];
const tabName = ["Unbond", "Pending Unbondings"];
const tableHeaders = ["Amount", "Available"];

const UnstakingModalContent = ({
  removeableTokens,
  tokenName,
  exchangeRate,
  doWithdraw,
  refreshBalance,
  refreshFromBalance,
  claims,
  refreshClaims,
  doClaim,
  onClose,
}: {
  removeableTokens: number;
  tokenName: string;
  exchangeRate: number;
  doWithdraw: (
    args_0: { amount: string; contract: string; msg: string },
    args_1?: number | "auto" | StdFee | undefined,
    args_2?: string | undefined,
    args_3?: Coin[] | undefined,
  ) => Promise<any>;
  doClaim: (
    fee?: number | "auto" | StdFee | undefined,
    memo?: string | undefined,
    funds?: Coin[] | undefined,
  ) => Promise<ExecuteResult>;
  refreshBalance: () => void;
  refreshFromBalance: () => void;
  onClose: () => void;
  claims: Claim[];
  refreshClaims: () => void;
}) => {
  const [removeValue, setRemoveValue] = useState(35);
  const [loading, setLoading] = useState<boolean>(false);
  const { address: walletAddress } = useWallet();
  const { txToast } = useToast();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [claimable, setClaimable] = useState<boolean>(false);

  useEffect(() => {
    claims.map(({ amount, release_at }) => {
      //@ts-ignore
      if (Number(release_at.at_time) / 1000000 < new Date().getTime()) {
        setClaimable(true);
      }
    });
  }, [claims]);

  /**
   * Unbonding
   */
  const unbond = async () => {
    setLoading(true);
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doWithdraw({
        amount: (Number((removeValue / 100) * removeableTokens) * 10 ** 6).toFixed(0),
        contract: "juno1ja9eyz4x7lnnvv56k30t2dfv68ln9hzkkfaj3uthvwzj2ppc470qyylhwv",
        msg: btoa(`{"unbond": {}}`),
      });
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshBalance();
      refreshFromBalance();
      refreshClaims();
      return result;
    });
    setTabIndex(1);
    setLoading(false);
  };

  /**
   * Claiming
   */
  const claim = async () => {
    setLoading(true);
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doClaim();
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshBalance();
      refreshFromBalance();
      refreshClaims();
      return result;
    });
    onClose();
    setLoading(false);
  };

  return (
    <Tabs isFitted={true} colorScheme="primary" onChange={(index) => setTabIndex(index)} mb={6}>
      <TabList mb="1em">
        {tabName.map((name, index) => (
          <Tab
            key={index}
            _hover={{ color: index !== tabIndex && "primary.300" }}
            _focus={{ outline: "none" }}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel p={8}>
          <Box>
            <Text fontSize={{ base: "xl", sm: "xl" }} fontWeight="semibold" textAlign="center">
              {tokenName}
            </Text>
            <Text fontSize={{ base: "5xl", sm: "7xl" }} fontWeight="bold" textAlign="center">
              {((removeValue / 100) * removeableTokens).toFixed(6)}
            </Text>
            <Flex justify="center" pb={10}>
              ≈ {((removeValue / 100) * removeableTokens * exchangeRate).toFixed(6)} JUNO
            </Flex>
            <Slider
              min={0}
              max={100}
              step={0.1}
              size="lg"
              colorScheme="primary"
              defaultValue={removeValue}
              value={removeValue}
              onChange={(val) => setRemoveValue(val)}
              mb={16}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb w={{ base: 5, sm: 7 }} h={{ base: 5, sm: 7 }} />
            </Slider>
            <SimpleGrid columns={{ sm: 4 }} spacing={4} mb={20}>
              {gaps.map((v, i) => (
                <Button key={i} variant="outline" onClick={() => setRemoveValue(v)}>
                  {v}%
                </Button>
              ))}
            </SimpleGrid>
            <Box px={{ sm: 12 }}>
              <Button
                isDisabled={removeValue > 0 ? false : true}
                w="full"
                size="lg"
                h={{ base: 12, sm: 14 }}
                isLoading={loading}
                loadingText={"Executing"}
                onClick={() => unbond()}
              >
                Unbond
              </Button>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel>
          <TableContainer>
            <Table borderRadius="1rem 1rem 0 0" overflow="hidden">
              <Thead bg={"wynd.base.sidebar"}>
                <Tr>
                  {tableHeaders.map((header) => (
                    <Td key={header} fontSize="md" fontWeight="semibold" letterSpacing="normal">
                      {header}
                    </Td>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {claims.length > 0 ? (
                  claims.map(({ amount, release_at }, i) => {
                    return (
                      <Tr key={i}>
                        <Td fontWeight="semibold">
                          {microamountToAmount(amount, 6)} {tokenName}
                        </Td>
                        <Td fontWeight="semibold">
                          {/*@ts-ignore */}
                          {Number(release_at.at_time) / 1000000 > new Date().getTime() ? (
                            <>
                              {/*@ts-ignore */}
                              {new Date(Number(release_at.at_time) / 1000000).toLocaleDateString()}{" "}
                              {/*@ts-ignore */}
                              {new Date(Number(release_at.at_time) / 1000000).toLocaleTimeString()}
                            </>
                          ) : (
                            <Text noOfLines={1}>
                              <BsPatchCheckFill style={{ display: "inline" }} /> Ready to claim!
                            </Text>
                          )}
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td fontWeight="semibold" colSpan={4}>
                      You currently have no bondings.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          {claimable && (
            <Button w={"100%"} isLoading={loading} onClick={() => claim()} borderTopRadius={0}>
              Claim now!
            </Button>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export const UnstakingModal = ({
  isOpen,
  onClose,
  removeableTokens,
  tokenName,
  exchangeRate,
  doWithdraw,
  refreshBalance,
  refreshFromBalance,
  claims,
  refreshClaims,
  doClaim,
}: {
  isOpen: boolean;
  onClose: () => void;
  removeableTokens: number;
  tokenName: string;
  exchangeRate: number;
  doWithdraw: (
    args_0: { amount: string; contract: string; msg: string },
    args_1?: number | "auto" | StdFee | undefined,
    args_2?: string | undefined,
    args_3?: Coin[] | undefined,
  ) => Promise<ExecuteResult>;
  doClaim: (
    fee?: number | "auto" | StdFee | undefined,
    memo?: string | undefined,
    funds?: Coin[] | undefined,
  ) => Promise<ExecuteResult>;
  refreshBalance: () => void;
  refreshFromBalance: () => void;
  claims: Claim[];
  refreshClaims: () => void;
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
    <ModalOverlay />
    <ModalContent height={"650px"} p={0} bgColor="wynd.base.subBg">
      <ModalHeader>Unstake</ModalHeader>
      <ModalCloseButton />
      <ModalBody p={0}>
        <Suspense fallback={<p>Loading...</p>}>
          <UnstakingModalContent
            refreshBalance={refreshBalance}
            refreshFromBalance={refreshFromBalance}
            exchangeRate={exchangeRate}
            tokenName={tokenName}
            removeableTokens={removeableTokens}
            doWithdraw={doWithdraw}
            claims={claims}
            refreshClaims={refreshClaims}
            doClaim={doClaim}
            onClose={onClose}
          />
        </Suspense>
      </ModalBody>
    </ModalContent>
  </Modal>
);
