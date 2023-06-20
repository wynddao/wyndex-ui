import {
  Box,
  chakra,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { Suspense, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";

import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

import {
  getAssetByDenom,
  getAssetByTokenAddr,
  getAssetInfoDetails,
  getAssetPrice,
} from "../../../utils/assets";
import { microamountToAmount } from "../../../utils/tokens";
import { DataTableSkeleton } from "./Skeletons/DataTableSkeleton";
import CreatePoolModal from "./CreatePoolModal";
import { useIndexerInfos } from "../../../state";

export type DataTableProps<Data extends object> = {
  data: Data[];
  userAssets: string[];
  columns: ColumnDef<Data, any>[];
  assetPrices: any;
  allAprs: any;
  permlessAssets: any;
};

export function DataTable<Data extends object>({
  data,
  columns,
  userAssets,
  assetPrices,
  allAprs,
  permlessAssets
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const handleRowClick = (row: any) => {
    router.push(`/pools/${row.original.address}`);
  };

  const fuzzyFilter: FilterFn<any> = (row, _, value) => {
    const filter = value.toLowerCase();
    const tokenPool = row.getValue("poolName") as { type: "token" | "native"; value: string }[];
    const token1 =
      tokenPool[0].type === "native"
        ? getAssetByDenom(tokenPool[0].value)
        : getAssetByTokenAddr(tokenPool[0].value);
    const token2 =
      tokenPool[1].type === "native"
        ? getAssetByDenom(tokenPool[1].value)
        : getAssetByTokenAddr(tokenPool[1].value);

    return token1?.symbol.toLowerCase().includes(filter)
      ? true
      : token2?.symbol.toLowerCase().includes(filter)
      ? true
      : false;
  };

  const table = useReactTable({
    columns,
    data,
    enableFilters: true,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    sortingFns: {
      customTVLSorting: (rowA: any, rowB: any, columnId: any): number => {
        const [{ value: token1 }, { value: token2 }] = rowA.getValue(columnId);
        const tokenPrice1A = getAssetPrice(token1, assetPrices);
        const tokenPrice2A = getAssetPrice(token2, assetPrices);
        const tokenInfo1A = getAssetInfoDetails(token1, permlessAssets);
        const tokenInfo2A = getAssetInfoDetails(token2, permlessAssets);

        const [{ value: token1B }, { value: token2B }] = rowB.getValue(columnId);
        const tokenPrice1B = getAssetPrice(token1B, assetPrices);
        const tokenPrice2B = getAssetPrice(token2B, assetPrices);
        const tokenInfo1B = getAssetInfoDetails(token1B, permlessAssets);
        const tokenInfo2B = getAssetInfoDetails(token2B, permlessAssets);

        return Number(
          tokenPrice1A.priceInUsd * Number(microamountToAmount(token1.amount, tokenInfo1A.decimals)) +
            tokenPrice2A.priceInUsd * Number(microamountToAmount(token2.amount, tokenInfo2A.decimals)),
        ) >
          Number(
            tokenPrice1B.priceInUsd * Number(microamountToAmount(token1B.amount, tokenInfo1B.decimals)) +
              tokenPrice2B.priceInUsd * Number(microamountToAmount(token2B.amount, tokenInfo2B.decimals)),
          )
          ? 1
          : -1;
      },
      customAPRSorting: (rowA: any, rowB: any, columnId: any): number => {
        const aprsA = allAprs.find((el: any) => el.pool === rowA.getValue(columnId)).apr;
        const aprsB = allAprs.find((el: any) => el.pool === rowB.getValue(columnId)).apr;

        return aprsA > aprsB ? 1 : -1;
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      sorting,
    },
  });

  return (
    <>
      <CreatePoolModal isOpen={isOpen} onClose={onClose} />
      <Box my={4}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
          bgClip="text"
          display="inline-block"
        >
          All Pools
        </Text>
        <Flex
          gap="1rem"
          flexFlow={{ base: "column", sm: "row" }}
          alignItems={{ base: "start", sm: "center" }}
          justifyContent="space-between"
        >
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <Icon as={IoSearch} w="1rem" h="1rem" color={"wynd.neutral.900"} />
            </InputLeftElement>
            <Input
              placeholder="search..."
              borderRadius="md"
              bg="wynd.base.subBg"
              border="none"
              value={globalFilter}
              onChange={({ target }) => setGlobalFilter(target.value)}
            />
          </InputGroup>
          <Button onClick={onOpen}>Create Pool</Button>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            variant="flushed"
            display="inline-block"
            w={200}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>
      </Box>
      <Box borderRadius="lg" overflow="auto">
        <Suspense fallback={<DataTableSkeleton />}>
          <Table variant="simple">
            <Thead display={{ base: "none", md: "table-header-group" }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} bgColor={"wynd.base.sidebar"}>
                  {headerGroup.headers.map((header) => {
                    const meta: any = header.column.columnDef.meta;
                    return (
                      <Th
                        cursor={header.column.getCanSort() ? "pointer" : "default"}
                        key={header.id}
                        onClick={() => header.column.toggleSorting()}
                        isNumeric={meta?.isNumeric}
                      >
                        <chakra.div display="inline-block">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() &&
                            (header.column.getIsSorted() ? (
                              header.column.getIsSorted() === "desc" ? (
                                <RxTriangleDown
                                  style={{ display: "inline-block" }}
                                  aria-label="sorted descending"
                                />
                              ) : (
                                header.column.getIsSorted() === "asc" && (
                                  <RxTriangleUp
                                    style={{ display: "inline-block" }}
                                    aria-label="sorted ascending"
                                  />
                                )
                              )
                            ) : null)}
                        </chakra.div>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => {
                const [{ value: token1 }, { value: token2 }] = row.getValue("poolName") as {
                  value: string;
                }[];
                const canBeProvider = userAssets.includes(token1) && userAssets.includes(token2);
                return (
                  <Tr
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    background={canBeProvider ? "wynd.gray.alpha.20" : ""}
                    cursor="pointer"
                    backgroundImage={"url(/images/Vector2Bg.png)"}
                    backgroundSize="cover"
                    backgroundRepeat="repeat"
                    backgroundAttachment="fixed"
                    borderBottom="1px solid"
                    borderColor="gray.700"
                    _hover={{
                      backgroundColor: "wynd.gray.alpha.10",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                      const meta: any = cell.column.columnDef.meta;
                      return (
                        <Td
                          key={cell.id}
                          isNumeric={meta?.isNumeric}
                          border="none"
                          display={{ base: "inline-block", md: "table-cell" }}
                        >
                          <chakra.div
                            display={{ base: "inline-block", md: "none" }}
                            bg="wynd.base.sidebar"
                            p={2}
                            mr={2}
                            mb={2}
                            borderRadius="md"
                            onClick={(event) => {
                              event.stopPropagation();
                              cell.column.toggleSorting();
                            }}
                          >
                            {cell.column.columnDef.header?.toString()}
                            {cell.column.getCanSort() &&
                              (cell.column.getIsSorted() ? (
                                cell.column.getIsSorted() === "desc" ? (
                                  <RxTriangleDown
                                    style={{ display: "inline-block" }}
                                    aria-label="sorted descending"
                                  />
                                ) : (
                                  cell.column.getIsSorted() === "asc" && (
                                    <RxTriangleUp
                                      style={{ display: "inline-block" }}
                                      aria-label="sorted ascending"
                                    />
                                  )
                                )
                              ) : null)}
                          </chakra.div>
                          <br />
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Suspense>
      </Box>
      <Flex mt={3} justifyContent={"end"} alignItems={"center"}>
        <Stack direction="row" spacing="4px" mr={3}>
          <IconButton
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            aria-label="Previous Page"
            icon={<HiChevronLeft />}
          />
          <IconButton
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            icon={<HiChevronRight />}
            aria-label="Next Page"
          />
        </Stack>
        <Text>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </Text>
      </Flex>
    </>
  );
}
