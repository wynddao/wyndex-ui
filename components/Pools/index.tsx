"use client";
import { Box, Text } from "@chakra-ui/react";
import { useFactoryInfos } from "../../state/hooks/useFactoryInfos";
import { DataTable } from "./DataTable";
import PoolsCard from "./PoolsCard";
import { createColumnHelper } from "@tanstack/react-table";
import { useIndexerInfos } from "../../state";
import { microamountToAmount, microdenomToDenom } from "../../utils/tokens";
import TokenName from "../TokenName";

export default function Pools() {
  const { pools, userPools } = useIndexerInfos({ fetchPoolData: true });

  type AssetInfoIndexer =
    | {
        token: string;
        amount: string;
      }
    | {
        native_token: string;
        amount: string;
      };

  type PoolListEntry = {
    address: string;
    assets: AssetInfoIndexer[];
  };

  const data: PoolListEntry[] = Object.keys(pools).map((poolAddress) => {
    return {
      address: poolAddress,
      assets: pools[poolAddress],
      unbondingPeriods: [1, 2, 3, 4],
    };
  });

  const columnHelper = createColumnHelper<PoolListEntry>();

  const columns = [
    columnHelper.accessor(
      (row) => {
        return [
          {
            type: row.assets[0].hasOwnProperty("token") ? "token" : "native_token",
            // @ts-ignore
            value: row.assets[0].hasOwnProperty("token") ? row.assets[0].token : row.assets[0].native_token,
          },
          {
            type: row.assets[1].hasOwnProperty("token") ? "token" : "native_token",
            // @ts-ignore
            value: row.assets[1].hasOwnProperty("token") ? row.assets[1].token : row.assets[1].native_token,
          },
        ];
      },
      {
        id: "poolName",
        header: "Pool",
        filterFn: "auto",
        cell: (props) => (
          <>
            {props.getValue()[0].type === "native_token" ? (
              <span>{`${microdenomToDenom(props.getValue()[0].value)}`}</span>
            ) : (
              <TokenName address={props.getValue()[0].value} />
            )}
            {" / "}
            {props.getValue()[1].type === "native_token" ? (
              <span>{`${microdenomToDenom(props.getValue()[1].value)}`}</span>
            ) : (
              <TokenName address={props.getValue()[1].value} />
            )}
          </>
        ),
      },
    ),
    columnHelper.accessor(
      (row) => {
        return [
          {
            type: row.assets[0].hasOwnProperty("token") ? "token" : "native_token",
            // @ts-ignore
            value: row.assets[0].hasOwnProperty("token") ? row.assets[0].token : row.assets[0].native_token,
            amount: row.assets[0].amount,
          },
          {
            type: row.assets[1].hasOwnProperty("token") ? "token" : "native_token",
            // @ts-ignore
            value: row.assets[1].hasOwnProperty("token") ? row.assets[1].token : row.assets[1].native_token,
            amount: row.assets[1].amount,
          },
        ];
      },
      {
        id: "assets",
        header: "Liquidity",
        cell: (props) => (
          <>
            {microamountToAmount(props.getValue()[0].amount, 6)}{" "}
            {props.getValue()[0].type === "native_token" ? (
              <span>{`${microdenomToDenom(props.getValue()[0].value)}`}</span>
            ) : (
              <TokenName symbol={true} address={props.getValue()[0].value} />
            )}
            {" / "}
            {microamountToAmount(props.getValue()[1].amount, 6)}{" "}
            {props.getValue()[1].type === "native_token" ? (
              <span>{`${microdenomToDenom(props.getValue()[1].value)}`}</span>
            ) : (
              <TokenName symbol={true} address={props.getValue()[1].value} />
            )}
          </>
        ),
      },
    ),
  ];

  return (
    <Box p="4">
      <Box m={-4} px={4}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          my={4}
          bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
          bgClip="text"
          display="inline-block"
        >
          My Pools
        </Text>

        <PoolsCard poolsData={userPools} />
      </Box>
      <DataTable columns={columns} data={data} />
      {/* <CreatePoolModal isOpen={isOpen} onClose={onClose} /> */}
    </Box>
  );
}
