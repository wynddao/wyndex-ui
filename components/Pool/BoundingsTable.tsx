"use client";

import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { UnbondingPeriodListData } from ".";

interface BoundingsTableProps {
  readonly unbondingPeriodList: readonly UnbondingPeriodListData[];
}

export default function BoundingsTable({ unbondingPeriodList }: BoundingsTableProps) {
  const tableHeaders = ["Unbonding Duration", "Current APR", "Amount", "Action"];

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
            {unbondingPeriodList.map(({ days, apr, amount }, i) => {
              return (
                <Tr key={i}>
                  <Td fontWeight="semibold">{days === "1" ? "a day" : `${days} days`}</Td>
                  <Td fontWeight="semibold">{apr}%</Td>
                  <Td fontWeight="semibold">{amount} GAMM/2</Td>
                  <Td>
                    <Button variant="unstyled" color="orange.300" isDisabled={amount === 0}>
                      Unbonding All
                    </Button>
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
