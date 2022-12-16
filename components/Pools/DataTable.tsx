import * as React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Stack,
  Button,
  IconButton,
  Flex,
  Text,
  Select,
  Box,
  Input,
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
  getFilteredRowModel
} from "@tanstack/react-table";

import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";

import { useRouter } from "next/navigation";

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
};

export function DataTable<Data extends object>({ data, columns }: DataTableProps<Data>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const router = useRouter();
  const handleRowClick = (row: any) => {
    router.push(`/pools/${row.original.address}`);
  };

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const table = useReactTable(
    {
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      filterFns: {
        fuzzy: fuzzyFilter,
      },
      state: {
        globalFilter,
        sorting,
      },
      globalFilterFn: fuzzyFilter,
      onGlobalFilterChange: setGlobalFilter,
      getFilteredRowModel: getFilteredRowModel(),
    },
  );

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          my={4}
          bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
          bgClip="text"
          display="inline-block"
        >
          All Pools
        </Text>
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
      <Box borderRadius="lg" overflow="hidden">
        <Table variant="simple">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} bgColor={"wynd.base.sidebar"}>
                {headerGroup.headers.map((header) => {
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}
                    >
                      <chakra.div display="inline-block">
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
            {table.getRowModel().rows.map((row) => (
              <Tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                _hover={{ cursor: "pointer", backgroundColor: "wynd.base.sidebarHover" }}
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
            ))}
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
