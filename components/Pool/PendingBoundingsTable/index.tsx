import {
  Box,
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
import { useEffect } from "react";
import { useState } from "react";
import { useStakeInfos } from "../../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../../state/hooks/useUserStakeInfos";
import { convertSeconds } from "../../../utils/time";
import { getPendingRebonding } from "./util";

interface PendingBoundingsTableOptions {
  wyndexStake: string;
  tokenName: any;
}

export default function PendingBoundingsTable(props: PendingBoundingsTableOptions) {
  const { wyndexStake, tokenName } = props;
  const { infos } = useStakeInfos(wyndexStake);
  const { address: walletAddress } = useWallet();
  const { pendingStakes } = useUserStakeInfos(wyndexStake, walletAddress || "");

  const [rebondings, setRebondings] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    const pendingRebonding = infos.map(async (info) => {
      return await getPendingRebonding(walletAddress || "", info.unbonding_period, wyndexStake);
    });
    Promise.all(pendingRebonding).then((res) => setRebondings(res));
  }, [infos, walletAddress, wyndexStake]);

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        My Pending Rebondings
      </Text>
      <TableContainer>
        <Table borderRadius="1rem 1rem 0 0" overflow="hidden">
          <Thead bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}>
            <Tr>
              <Td fontSize="md" fontWeight="semibold" letterSpacing="normal">
                Amount
              </Td>
              <Td fontSize="md" fontWeight="semibold" letterSpacing="normal">
                Available
              </Td>
              <Td fontSize="md" fontWeight="semibold" letterSpacing="normal">
                Description
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            {rebondings &&
              rebondings.map((period, x) =>
                period.locked_tokens && period.locked_tokens.length > 0 ? (
                  period.locked_tokens.map((amount: string[], i: number) => (
                    <Tr key={i}>
                      <Td fontWeight="semibold">
                        {amount[1]} {tokenName}
                      </Td>
                      <Td fontWeight="semibold">
                        {new Date(Number(amount[0]) / 1000000).toLocaleDateString()}{" "}
                        {new Date(Number(amount[0]) / 1000000).toLocaleTimeString()}
                      </Td>
                      <Td fontWeight="semibold">
                        Rebonded down to {convertSeconds(infos[x].unbonding_period).days} days
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <></>
                ),
              )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
