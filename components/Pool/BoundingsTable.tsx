import { Box, Button, Flex, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";
import { UseTokenNameResponse } from "../../state";
import { PairInfo } from "../../state/clients/types/WyndexFactory.types";
import { BondingPeriodInfo, StakedResponse } from "../../state/clients/types/WyndexStake.types";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import { secondsToDays } from "../../utils/time";
import { microamountToAmount } from "../../utils/tokens";
import ManageBoundingsModal from "./ManageBoundingsModal";
import { getApr } from "./util/apr";
interface BoundingsTableProps {
  readonly stakeContract: string;
  liquidityTokenInfo: UseTokenNameResponse;
  apr: {
    unbonding_period: number;
    apr: number;
  }[];
  pairData: PairInfo;
}

export default function BoundingsTable({
  stakeContract,
  liquidityTokenInfo,
  apr,
  pairData,
}: BoundingsTableProps) {
  const tableHeaders = ["Bonded Tier", "Current APR", "Amount", "Action"];
  const { address } = useWallet();
  const { infos } = useStakeInfos(stakeContract);

  //@ts-ignore
  const { allStakes } = useUserStakeInfos(stakeContract, address);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeStake, setActiveStake] = useState<StakedResponse | undefined>(undefined);
  const [nextDuration, setNextDuration] = useState<BondingPeriodInfo | undefined>(undefined);
  const [prevDuration, setPrevDuration] = useState<BondingPeriodInfo | undefined>(undefined);

  const getNextOrPrevDurationTime = (
    stake: StakedResponse,
    higher: boolean,
  ): BondingPeriodInfo | undefined => {
    const selectedIndex = infos
      .map((e) => {
        return e.unbonding_period;
      })
      .indexOf(stake.unbonding_period);

    if (higher) {
      return selectedIndex + 1 in infos ? infos[selectedIndex + 1] : undefined;
    } else {
      return selectedIndex - 1 in infos ? infos[selectedIndex - 1] : undefined;
    }
  };

  return (
    <>
      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4} color="wynd.green.500" display="inline-block">
          My Bonded Liquidity
        </Text>
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
              {allStakes.length > 0 ? (
                allStakes.map(({ stake, unbonding_period }, i) => {
                  return (
                    <Tr key={i}>
                      <Td fontWeight="semibold">{secondsToDays(unbonding_period)} Days Unbonding</Td>
                      <Td fontWeight="semibold">{getApr(apr, unbonding_period)}</Td>
                      <Td fontWeight="semibold">
                        {microamountToAmount(stake, liquidityTokenInfo.tokenDecimals)}{" "}
                        {liquidityTokenInfo.tokenSymbol}
                      </Td>
                      <Td>
                        <Flex>
                          <Button
                            onClick={() => {
                              setModalOpen(true);
                              setActiveStake(allStakes[i]);
                              setPrevDuration(getNextOrPrevDurationTime(allStakes[i], false));
                              setNextDuration(getNextOrPrevDurationTime(allStakes[i], true));
                            }}
                            variant="outline"
                            bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
                            bgClip="text"
                            marginRight={3}
                            _hover={{
                              bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                              bgClip: "text",
                            }}
                          >
                            Manage
                          </Button>
                        </Flex>
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
      </Box>
      {activeStake ? (
        <ManageBoundingsModal
          wyndexStakeAddress={stakeContract}
          higherDuration={nextDuration}
          lowerDuration={prevDuration}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          tokenInfo={liquidityTokenInfo}
          stake={activeStake}
          pairData={pairData}
        />
      ) : null}
    </>
  );
}
