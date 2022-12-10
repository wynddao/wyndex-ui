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
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { secondsToDays } from "../../utils/time";

interface PendingUnbondingsTableProps {
  stakeAddress: string;
  tokenName: any;
}

export default function PendingUnbondingsTable(props: PendingUnbondingsTableProps) {
  const { stakeAddress, tokenName } = props;
  const { pendingUnstaking } = useStakeInfos(stakeAddress, true);

  const tableHeaders = ["Amount", "Available", "Action"];

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        My Pending Unbondings
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
            {pendingUnstaking.length > 0 ? (
              pendingUnstaking.map(({ amount, release_at }, i) => {
                return (
                  <Tr key={i}>
                    <Td fontWeight="semibold">
                      {amount} {tokenName}
                    </Td>
                    <Td fontWeight="semibold">
                      {/*@ts-ignore */}
                      {new Date(Number(release_at.at_time) / 1000000).toLocaleDateString()} {/*@ts-ignore */}
                      {new Date(Number(release_at.at_time) / 1000000).toLocaleTimeString()}
                    </Td>
                    <Td>
                      <Flex>
                        <Button variant="solid" color="orange.300" marginRight={3}>
                          Claim
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
  );
}
