import { Table, Tbody, Th, Thead, Tr, chakra, Td, Skeleton } from "@chakra-ui/react";
import { RxTriangleDown } from "react-icons/rx";

export const DataTableSkeleton = () => (
  <Table variant="simple">
    <Thead>
      <Tr bgColor={"wynd.base.sidebar"}>
        <Th>POOL</Th>
        <Th>TVL</Th>
        <Th>APR</Th>
        <Th>LIQUIDITY</Th>
      </Tr>
    </Thead>
    <Tbody>
      {Array.from({ length: 10 }, (_, i) => (
        <Tr
          key={i}
          backgroundImage={"url(/images/Vector2Bg.png)"}
          backgroundSize="cover"
          backgroundRepeat="repeat"
          backgroundAttachment="fixed"
        >
          <Td>
            <Skeleton height={4} />
          </Td>
          <Td>
            <Skeleton height={4} />
          </Td>
          <Td>
            <Skeleton height={4} />
          </Td>
          <Td>
            <Skeleton height={4} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);
