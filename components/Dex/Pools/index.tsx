"use client";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { createColumnHelper, FilterFn, SortingFn } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../state";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { WYND_TOKEN_ADDRESS } from "../../../utils";
import { getAprForPool } from "../../../utils/apr";
import { getAssetByDenom, getAssetInfoDetails, getAssetPrice } from "../../../utils/assets";
import { formatCurrency } from "../../../utils/currency";
import { microamountToAmount } from "../../../utils/tokens";

import AssetImage from "../AssetImage";
import CreatePoolModal from "./CreatePoolModal";
import TokenName from "../TokenName";
import { DataTable } from "./DataTable";
import MaxApr from "./MaxApr";
import PoolsCard from "./PoolsCard";
import { DataTableSkeleton } from "./Skeletons/DataTableSkeleton";
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface SortingFns {
    customTVLSorting: SortingFn<unknown>;
    customAPRSorting: SortingFn<unknown>;
  }
}

export interface AllAprEntry {
  poolAddress: string;
  maxApr: string;
}

export default function Pools({ pools, userPools, assetPrices, ibcBalances, cw20Balances }: any) {
  const { connect, isWalletConnected } = useChain("juno");

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

  const disabledPools = [
    "juno16xrz7kd26j0qmdg706qyesqs56g2f6dulplsajtl0t9z8frd8tfqsx2lkj",
    "juno1jtendlawm8rv96hnfuwn04y8uhwzp9epcxy5f0ms973pspueqcgsy3qzt0",
    "juno1x9r54vejw4hnxe7xm4haaf0ymf825frm30xqf9cud6cmnrgkx9lsxpj475",
    "juno14ke9xn3qfmnjsrh9lh6rfu7zmm90duvj4lpkcrrnzemh0tjpwarqfk97n6",
    "juno10hw5a052a9jcmcgzx27ssyddf2unrk35ltfz3a7hl63hfd8e7dsqvfue4d",
    "juno1z62rxfn9gh4wzndk48hfnfkmjca0f85j2cy77q68n2hyz7qdqcwq2jzjga",
  ];

  const [allAprs, setAllAprs] = useState<any[]>([]);
  const loadData = async () => {
    const _allAprs = Object.keys(pools)
      .filter((poolAddress) => !disabledPools.includes(poolAddress))
      .map(async (poolAddress) => {
        const res = await getAprForPool(poolAddress, assetPrices);
        return {
          apr: res[res.length - 1].apr,
          pool: poolAddress,
        };
      });
    setAllAprs(await Promise.all(_allAprs));
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data: PoolListEntry[] = Object.keys(pools)
    .filter((poolAddress) => !disabledPools.includes(poolAddress))
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
      if (userAssets.includes(t1) && userAssets.includes(t2)) {
        return -1;
      } else {
        if (token1.token === WYND_TOKEN_ADDRESS || token2.token === WYND_TOKEN_ADDRESS) {
          return -1;
        }
      }
      return 1;
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
        enableSorting: false,
        cell: ({ getValue }) => (
          <Flex alignItems="center">
            <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
              <Box
                w={{ base: 6, md: 7, lg: 8 }}
                h={{ base: 6, md: 7, lg: 8 }}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor={"wynd.cyan.100"}
                overflow="hidden"
                p={0.5}
              >
                <AssetImage asset={getValue()[0].value as string} />
              </Box>
              <Box
                position="absolute"
                left={{ base: 4, sm: 5 }}
                w={{ base: 6, md: 7, lg: 8 }}
                h={{ base: 6, md: 7, lg: 8 }}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor={"wynd.cyan.100"}
                overflow="hidden"
                p={0.5}
              >
                <AssetImage asset={getValue()[1].value as string} />
              </Box>
            </Flex>
            {getValue()[0].type === "native" ? (
              <span>{`${getAssetByDenom(getValue()[0].value)?.symbol}`}</span>
            ) : (
              <TokenName symbol={true} address={getValue()[0].value} />
            )}
            {" / "}
            {getValue()[1].type === "native" ? (
              <span>{`${getAssetByDenom(getValue()[1].value)?.symbol}`}</span>
            ) : (
              <TokenName symbol={true} address={getValue()[1].value} />
            )}
          </Flex>
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
        sortingFn: "customTVLSorting",
        cell: (props) => {
          const [{ value: token1 }, { value: token2 }] = props.getValue();
          const tokenPrice1 = getAssetPrice(token1, assetPrices);
          const tokenPrice2 = getAssetPrice(token2, assetPrices);
          const tokenInfo1 = getAssetInfoDetails(token1);
          const tokenInfo2 = getAssetInfoDetails(token2);
          return (
            <>
              {formatCurrency(
                currency,
                Number(
                  (currency === "USD" ? tokenPrice1.priceInUsd : tokenPrice1.priceInEur) *
                    Number(microamountToAmount(token1.amount, tokenInfo1.decimals)) +
                    (currency === "USD" ? tokenPrice2.priceInUsd : tokenPrice2.priceInEur) *
                      Number(microamountToAmount(token2.amount, tokenInfo2.decimals)),
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
      sortingFn: "customAPRSorting",
      cell: (props) => {
        return <MaxApr poolAddress={props.getValue()} assetPrices={assetPrices} />;
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
        enableSorting: false,
        cell: (props) => {
          const [token1, token2] = props.getValue();
          const tokenInfo1 = getAssetInfoDetails({ [token1.type]: token1.value });
          const tokenInfo2 = getAssetInfoDetails({ [token2.type]: token2.value });
          return (
            <>
              {microamountToAmount(token1.amount, tokenInfo1.decimals)} {tokenInfo1.symbol}
              {" / "}
              {microamountToAmount(token2.amount, tokenInfo2.decimals)} {tokenInfo2.symbol}
            </>
          );
        },
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
          <PoolsCard
            poolsData={userPools}
            allPools={pools}
            assetPrices={assetPrices}
            disabledPools={disabledPools}
          />
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
              bgGradient="linear-gradient(45deg, #3b6e3d, #73a86d)"
              _hover={{
                bgGradient: "linear-gradient(45deg, #4c8e48, #7ca66e)",
              }}
            >
              <Icon as={FiCreditCard} />
              <Text>Connect wallet</Text>
            </Button>
          </Flex>
        )}
      </Box>
      {allAprs.length > 0 ? (
        <DataTable
          allAprs={allAprs}
          assetPrices={assetPrices}
          columns={columns}
          data={data}
          userAssets={userAssets}
        />
      ) : (
        <DataTableSkeleton />
      )}
      {/* <CreatePoolModal isOpen={isOpen} onClose={onClose} /> */}
    </Box>
  );
}
