"use client";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { DataTable } from "./DataTable";
import PoolsCard from "./PoolsCard";
import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { useIndexerInfos } from "../../state";
import { microamountToAmount, microdenomToDenom } from "../../utils/tokens";
import TokenName from "../TokenName";
import { getAssetByDenom, getAssetPrice, getNativeIbcTokenDenom } from "../../utils/assets";
import { formatCurrency } from "../../utils/currency";
import MaxApr from "./MaxApr";
import { useRecoilValue } from "recoil";
import { currencyAtom } from "../../state/recoil/atoms/settings";
import { useMemo } from "react";
import { useWallet } from "@cosmos-kit/react";
import { FiCreditCard } from "react-icons/fi";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

export default function Pools() {
  const { connect, isWalletConnected } = useWallet();

  const { pools, userPools, assetPrices, ibcBalances, cw20Balances } = useIndexerInfos({
    fetchPoolData: true,
    fetchIbcBalances: true,
    fetchCw20Balances: true,
  });

  const currency = useRecoilValue(currencyAtom);

  const userAssets = useMemo(
    () => [...ibcBalances, ...cw20Balances].map((t: any) => t.denom || t.address),
    [ibcBalances, cw20Balances],
  );

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

  const data: PoolListEntry[] = Object.keys(pools)
    .map((poolAddress) => {
      return {
        address: poolAddress,
        assets: pools[poolAddress],
        unbondingPeriods: [1, 2, 3, 4],
      };
    })
    .sort(({ assets }) => {
      const [token1, token2] = assets as { native: string; token: string }[];
      const t1 = token1.native || token1.token;
      const t2 = token2.native || token2.token;
      return userAssets.includes(t1) && userAssets.includes(t2) ? -1 : 1;
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
        enableColumnFilter: true,
        cell: (props) => (
          <>
            {props.getValue()[0].type === "native" ? (
              <span>{`${getAssetByDenom(props.getValue()[0].value)?.name}`}</span>
            ) : (
              <TokenName address={props.getValue()[0].value} />
            )}
            {" / "}
            {props.getValue()[1].type === "native" ? (
              <span>{`${getAssetByDenom(props.getValue()[1].value)?.name}`}</span>
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
              <span>{`${microdenomToDenom(getNativeIbcTokenDenom(props.getValue()[0].value))}`}</span>
            ) : (
              <TokenName symbol={true} address={props.getValue()[0].value} />
            )}
            {" / "}
            {microamountToAmount(props.getValue()[1].amount, 6)}{" "}
            {props.getValue()[1].type === "native" ? (
              <span>{`${microdenomToDenom(getNativeIbcTokenDenom(props.getValue()[1].value))}`}</span>
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
      <Box mb={6}>
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
        {isWalletConnected ? (
          <PoolsCard poolsData={userPools} allPools={pools} assetPrices={assetPrices} />
        ) : (
          <Flex
            borderRadius="md"
            p={4}
            bg={"whiteAlpha.50"}
            mb={4}
            alignItems="center"
            justifyContent="center"
            minH="8rem"
          >
            <Button
              onClick={connect}
              fontSize="sm"
              alignItems="center"
              justifyContent="center"
              gap="0.5rem"
              display="flex"
              bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
              _hover={{
                bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
              }}
            >
              <Icon as={FiCreditCard} />
              <Text>Connect wallet</Text>
            </Button>
          </Flex>
        )}
      </Box>
      <DataTable columns={columns} data={data} userAssets={userAssets} />
      {/* <CreatePoolModal isOpen={isOpen} onClose={onClose} /> */}
    </Box>
  );
}
