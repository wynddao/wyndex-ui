import { Box, Link } from "@chakra-ui/react";
import { ExecuteResult } from "cosmwasm";
import React from "react";
import { toast } from "react-hot-toast";
import { EXPLORER_URL } from "../../utils";

export default function TxToastSuccess({ tx }: { tx: ExecuteResult }) {
  return (
    <Box display="flex" gap="1rem" minW="fit-content" justifyContent="center" alignItems="center">
      <Box display="flex" flexFlow="column" paddingX="0.5rem">
        Tx Success
        <Link href={`${EXPLORER_URL}/${tx.transactionHash}`} isExternal color="gray.500">
          See transaction
        </Link>
      </Box>
      <Box
        as="button"
        onClick={() => toast.dismiss("tx.success")}
        pl="1rem"
        borderLeft="2px solid"
        borderLeftColor="gray.200"
        height="100%"
        _hover={{
          color: "brand.green.100",
        }}
        transition="all linear 0.5s"
      >
        Close
      </Box>
    </Box>
  );
}
