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
import { UseTokenNameResponse } from "../../../../state";
import { useStakeInfos } from "../../../../state/hooks/useStakeInfos";
import { secondsToDays } from "../../../../utils/time";
import { microamountToAmount } from "../../../../utils/tokens";
import { getPendingRebonding } from "./util";
import { useTranslation } from "i18next-ssg";

interface PendingBoundingsTableOptions {
  wyndexStake: string;
  tokenInfo: UseTokenNameResponse;
}

export default function PendingBoundingsTable(props: PendingBoundingsTableOptions) {
  const { wyndexStake, tokenInfo } = props;
  const { infos } = useStakeInfos(wyndexStake);
  const { address: walletAddress } = useWallet();

  const [rebondings, setRebondings] = useState<any[] | undefined>(undefined);
  const [hasAnyRebondings, setHasAnyRebondings] = useState<boolean>(false);
  const { t } = useTranslation("common");
  useEffect(() => {
    const pendingRebonding = infos.map(async (info) => {
      return await getPendingRebonding(walletAddress || "", info.unbonding_period, wyndexStake);
    });
    Promise.all(pendingRebonding).then((res) => {
      const hasRebonded = res.find((e) => {
        return e.locked_tokens.length > 0;
      });

      setHasAnyRebondings(hasRebonded ? true : false);
      setRebondings(res);
    });
  }, [infos, walletAddress, wyndexStake]);

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4} color="wynd.green.500" display="inline-block">
        {t("pool.myPendingRebondings")}
      </Text>
      <TableContainer>
        <Table borderRadius="1rem 1rem 0 0" overflow="hidden">
          <Thead bg={"wynd.base.sidebar"}>
            <Tr>
              <Td fontSize="md" fontWeight="semibold" letterSpacing="normal">
                {t("general.amount")}
              </Td>
              <Td fontSize="md" fontWeight="semibold" letterSpacing="normal">
                {t("general.available")}
              </Td>
              <Td fontSize="md" fontWeight="semibold" letterSpacing="normal">
                {t("pool.description")}
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            {rebondings &&
              rebondings.map((period, x) =>
                period.locked_tokens && period.locked_tokens.length > 0 ? (
                  period.locked_tokens.map((amount: string[], i: number) => {
                    if (new Date().getTime() < Number(amount[0]) / 1000000) {
                      return (
                        <Tr key={i}>
                          <Td fontWeight="semibold">
                            {microamountToAmount(amount[1], tokenInfo.tokenDecimals)} {tokenInfo.tokenSymbol}
                          </Td>
                          <Td fontWeight="semibold">
                            {new Date(Number(amount[0]) / 1000000).toLocaleDateString()}{" "}
                            {new Date(Number(amount[0]) / 1000000).toLocaleTimeString()}
                          </Td>
                          <Td fontWeight="semibold">
                            {t("pool.rebondedDownTo")} {secondsToDays(infos[x].unbonding_period)}{" "}
                            {t("time.days")}
                          </Td>
                        </Tr>
                      );
                    }
                  })
                ) : (
                  <></>
                ),
              )}
            {!hasAnyRebondings && (
              <Tr>
                <Td fontWeight="semibold" colSpan={4}>
                  {t("pool.currentlyNoRebondings")}
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
