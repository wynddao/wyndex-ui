"use client";

import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";
import { StakedResponse } from "../../state/clients/types/WyndexStake.types";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import { secondsToDays } from "../../utils/time";
import ManageBoundingsModal from "./ManageBoundingsModal";

interface BoundingsTableProps {
  readonly stakeContract: string;
  tokenName: any;
}

export default function BoundingsTable({ stakeContract, tokenName }: BoundingsTableProps) {
  const tableHeaders = ["Unbonding Duration", "Current APR", "Amount", "Action"];
  const { address } = useWallet();
  //@ts-ignore
  const { allStakes } = useUserStakeInfos(stakeContract, address);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeStake, setActiveStake] = useState<StakedResponse | undefined>(undefined);
  const [nextDuration, setNextDuration] = useState<StakedResponse | undefined>(undefined);
  const [prevDuration, setPrevDuration] = useState<StakedResponse | undefined>(undefined);

  return (
    <>
      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          My Boundings
        </Text>
        <TableContainer>
          <Table borderRadius="1rem 1rem 0 0" overflow="hidden">
            <Thead bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}>
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
                      <Td fontWeight="semibold">{secondsToDays(unbonding_period)} Days</Td>
                      <Td fontWeight="semibold">20% @TODO</Td>
                      <Td fontWeight="semibold">
                        {stake} {tokenName}
                      </Td>
                      <Td>
                        <Flex>
                          <Button
                            onClick={() => {
                              setModalOpen(true);
                              setActiveStake(allStakes[i]);
                              setPrevDuration(i - 1 in allStakes ? allStakes[i - 1] : undefined);
                              setNextDuration(i + 1 in allStakes ? allStakes[i + 1] : undefined);
                            }}
                            variant="solid"
                            color="orange.300"
                            marginRight={3}
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
                  <Td fontWeight="semibold" colSpan={4}>You currently have no bondings.</Td>
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
          tokenName={tokenName}
          stake={activeStake}
        />
      ) : null}
    </>
  );
}
