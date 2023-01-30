import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Stack,
  IconButton,
  Flex,
  Text,
  Select,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import {
  getAssetByDenom,
  getAssetByTokenAddr,
  getAssetInfoDetails,
  getAssetPrice,
  RequestAssetPrice,
} from "../../../utils/assets";
import { microamountToAmount } from "../../../utils/tokens";

export type DataTableProps<Data extends object> = {
  data: Data[];
  userAssets: string[];
  columns: ColumnDef<Data, any>[];
  assetsPrice: RequestAssetPrice[];
};

export function DataTable<Data extends object>({
  data,
  columns,
  userAssets,
  assetsPrice,
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

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

  const tvlSort = (rowA: any, rowB: any, columnId: any) => {
    const [{ value: token1A }, { value: token2A }] = rowA.getValue(columnId);
    const tokenInfo1A = getAssetInfoDetails(token1A);
    const tokenInfo2A = getAssetInfoDetails(token2A);

    const token1AmountA = microamountToAmount(token1A.amount, tokenInfo1A.decimals);
    const token2AmountA = microamountToAmount(token2A.amount, tokenInfo2A.decimals);

    const { priceInUsd: tokenPrice1A } = getAssetPrice(token1A, assetsPrice);
    const { priceInUsd: tokenPrice2A } = getAssetPrice(token2A, assetsPrice);

    const rawAValue = Number(token1AmountA) * tokenPrice1A + Number(token2AmountA) * tokenPrice2A;

    const [{ value: token1B }, { value: token2B }] = rowB.getValue(columnId);
    const tokenInfo1B = getAssetInfoDetails(token1B);
    const tokenInfo2B = getAssetInfoDetails(token2B);

    const token1AmountB = microamountToAmount(token1B.amount, tokenInfo1B.decimals);
    const token2AmountB = microamountToAmount(token2B.amount, tokenInfo2B.decimals);

    const { priceInUsd: tokenPrice1B } = getAssetPrice(token1B, assetsPrice);
    const { priceInUsd: tokenPrice2B } = getAssetPrice(token2B, assetsPrice);

    const rawBValue = Number(token1AmountB) * tokenPrice1B + Number(token2AmountB) * tokenPrice2B;

    return rawAValue > rawBValue ? 1 : -1;
  };

  const poolNameSort = (rowA: any, rowB: any, columnId: any) => {
    const [tokenA] = rowA.getValue(columnId) as { value: string; type: string }[];

    const [tokenB] = rowB.getValue(columnId) as { value: string; type: string }[];

    return tokenA.value.localeCompare(tokenB.value);
  };

  const aprSort = (rowA: any, rowB: any, columnId: any) => {
    // Here is where APR sort
    return 1;
  };

  const table = useReactTable({
    columns,
    data,
    enableFilters: true,
    globalFilterFn: fuzzyFilter,
    sortingFns: {
      tvlSort,
      poolNameSort,
      aprSort,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        <Table variant="simple">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} bgColor={"wynd.base.sidebar"}>
                {headerGroup.headers.map((header) => {
                  const meta: any = header.column.columnDef.meta;
                  const sortFn = header.column.getToggleSortingHandler();
                  return (
                    <Th key={header.id} isNumeric={meta?.isNumeric}>
                      <chakra.div display="inline-block" cursor="pointer" onClick={sortFn}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "desc" ? (
                            <RxTriangleDown
                              style={{ display: "inline-block" }}
                              aria-label="sorted descending"
                            />
                          ) : (
                            <RxTriangleUp style={{ display: "inline-block" }} aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.div>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              const [{ value: token1 }, { value: token2 }] = row.getValue("poolName") as { value: string }[];
              const canBeProvider = userAssets.includes(token1) && userAssets.includes(token2);
              return (
                <Tr
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  background={canBeProvider ? "wynd.gray.alpha.20" : ""}
                  cursor="pointer"
                  backgroundImage={"url(/images/Vector2Bg.png)"}
                  backgroundSize="300px"
                  _hover={{
                    backgroundColor: "wynd.gray.alpha.10",
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <Td key={cell.id} isNumeric={meta?.isNumeric}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
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
