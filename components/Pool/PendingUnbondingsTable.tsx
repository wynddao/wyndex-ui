import { Box, Button, Flex, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { UseTokenNameResponse } from "../../state";
import { PairInfo } from "../../state/clients/types/WyndexFactory.types";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { microamountToAmount } from "../../utils/tokens";
import UnclaimModal from "./UnclaimModal";

interface PendingUnbondingsTableProps {
  stakeAddress: string;
  tokenInfo: UseTokenNameResponse;
  pairData: PairInfo;
}

export default function PendingUnbondingsTable(props: PendingUnbondingsTableProps) {
  const { stakeAddress, tokenInfo, pairData } = props;
  const { pendingUnstaking, refreshPendingUnstaking, infos } = useStakeInfos(stakeAddress, true);
  const [claimable, setClaimable] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [totalUnstakingAvaiable, setTotalUnstakingAvaiable] = useState<number>(0);

  const tableHeaders = ["Amount", "Available"];

  useEffect(() => {
    let sum = 0;
    pendingUnstaking.map(({ amount, release_at }) => {
      //@ts-ignore
      if (Number(release_at.at_time) / 1000000 < new Date().getTime()) {
        setClaimable(true);
        sum += Number(amount);
      }
    });
    setTotalUnstakingAvaiable(sum);
  }, [pendingUnstaking]);

  return (
    <>
      <Box p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" mb={4} color="wynd.green.500" display="inline">
            My Pending Unbondings
          </Text>
          {claimable && <Button onClick={() => setModalOpen(true)}>Claim now!</Button>}
        </Flex>
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
              {pendingUnstaking.length > 0 ? (
                pendingUnstaking.map(({ amount, release_at }, i) => {
                  return (
                    <Tr key={i}>
                      <Td fontWeight="semibold">
                        {microamountToAmount(amount, tokenInfo.tokenDecimals)} {tokenInfo.tokenSymbol}
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
      </Box>
      <UnclaimModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        totalUnstakingAvailable={totalUnstakingAvaiable}
        wyndexStakeAddress={stakeAddress}
        refreshPendingUnstaking={refreshPendingUnstaking}
        tokenInfo={tokenInfo}
        pairData={pairData}
      />
    </>
  );
}
