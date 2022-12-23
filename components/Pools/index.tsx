"use client";
import { Box, Text } from "@chakra-ui/react";
import { DataTable } from "./DataTable";
import PoolsCard from "./PoolsCard";
import { createColumnHelper } from "@tanstack/react-table";
import { useIndexerInfos } from "../../state";
import { microamountToAmount, microdenomToDenom } from "../../utils/tokens";
import TokenName from "../TokenName";
import { getAssetPrice } from "../../utils/assets";
import { formatCurrency, formatCurrencyStatic } from "../../utils/currency";
import MaxApr from "./MaxApr";
import { useRecoilValue } from "recoil";
import { currencyAtom } from "../../state/recoil/atoms/settings";

export default function Pools() {
  const { pools, userPools, assetPrices } = useIndexerInfos({ fetchPoolData: true });
  const currency = useRecoilValue(currencyAtom);

  type AssetInfoIndexer =
    | {
        token: string;
        amount: string;
      }
    | {
        native: string;
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
            type: row.assets[0].hasOwnProperty("token") ? "token" : "native",
            // @ts-ignore
            value: row.assets[0].hasOwnProperty("token") ? row.assets[0].token : row.assets[0].native,
          },
          {
            type: row.assets[1].hasOwnProperty("token") ? "token" : "native",
            // @ts-ignore
            value: row.assets[1].hasOwnProperty("token") ? row.assets[1].token : row.assets[1].native,
          },
        ];
      },
      {
        id: "poolName",
        header: "Pool",
        filterFn: "auto",
        cell: (props) => (
          <>
            {props.getValue()[0].type === "native" ? (
              <span>{`${microdenomToDenom(props.getValue()[0].value)}`}</span>
            ) : (
              <TokenName address={props.getValue()[0].value} />
            )}
            {" / "}
            {props.getValue()[1].type === "native" ? (
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
            value: row.assets[0],
          },
          {
            value: row.assets[1],
          },
        ];
      },
      {
        id: "tvl",
        header: "TVL",
        cell: (props) => {
          const tokenPrice1 = getAssetPrice(props.getValue()[0].value, assetPrices);
          const tokenPrice2 = getAssetPrice(props.getValue()[1].value, assetPrices);
          return (
            <>
              {formatCurrency(
                currency,
                Number(
                  (currency === "USD" ? tokenPrice1.priceInUsd : tokenPrice1.priceInEur) *
                    Number(microamountToAmount(props.getValue()[0].value.amount, 6)) +
                    (currency === "USD" ? tokenPrice2.priceInUsd : tokenPrice2.priceInEur) *
                      Number(microamountToAmount(props.getValue()[1].value.amount, 6)),
                ).toString(),
              )}
            </>
          );
        },
      },
    ),
    columnHelper.accessor((row) => row.address, {
      id: "apr",
      header: "APR",
      cell: (props) => {
        return <MaxApr poolAddress={props.getValue()} />;
      },
    }),
    columnHelper.accessor(
      (row) => {
        return [
          {
            type: row.assets[0].hasOwnProperty("token") ? "token" : "native",
            // @ts-ignore
            value: row.assets[0].hasOwnProperty("token") ? row.assets[0].token : row.assets[0].native,
            amount: row.assets[0].amount,
          },
          {
            type: row.assets[1].hasOwnProperty("token") ? "token" : "native",
            // @ts-ignore
            value: row.assets[1].hasOwnProperty("token") ? row.assets[1].token : row.assets[1].native,
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
            {props.getValue()[0].type === "native" ? (
              <span>{`${microdenomToDenom(props.getValue()[0].value)}`}</span>
            ) : (
              <TokenName symbol={true} address={props.getValue()[0].value} />
            )}
            {" / "}
            {microamountToAmount(props.getValue()[1].amount, 6)}{" "}
            {props.getValue()[1].type === "native" ? (
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

        <PoolsCard poolsData={userPools} allPools={pools} assetPrices={assetPrices} />
      </Box>
      <DataTable columns={columns} data={data} />
      {/* <CreatePoolModal isOpen={isOpen} onClose={onClose} /> */}
    </Box>
  );
}
