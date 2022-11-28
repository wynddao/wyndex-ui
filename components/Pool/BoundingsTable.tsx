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
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import { convertSeconds } from "../../utils/time";
import { UnbondingPeriod } from "../../utils/types";

interface BoundingsTableProps {
  readonly stakeContract: string;
  tokenName: any;
}

export default function BoundingsTable({ stakeContract, tokenName }: BoundingsTableProps) {
  const tableHeaders = ["Unbonding Duration", "Current APR", "Amount", "Action"];
  const { address } = useWallet();
  //@ts-ignore
  const { allStakes } = useUserStakeInfos(stakeContract, address);

  return (
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
            {allStakes.map(({ stake, unbonding_period }, i) => {
              return (
                <Tr key={i}>
                  <Td fontWeight="semibold">{convertSeconds(unbonding_period).days} Days</Td>
                  <Td fontWeight="semibold">20% @TODO</Td>
                  <Td fontWeight="semibold">
                    {stake} {tokenName}
                  </Td>
                  <Td>
                    <Flex>
                      <Button variant="solid" color="orange.300" marginRight={3}>
                        Rebond
                      </Button>
                      <Button variant="unstyled" color="orange.300">
                        Unbond
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
