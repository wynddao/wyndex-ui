import { Box, Button, Flex, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { CustomError } from "../../../utils/customError";

export default function TxToastError({ txError }: { txError: CustomError }) {
  const { onCopy, hasCopied } = useClipboard(txError.errorInstance?.message || "");
  const portalContainerRef = useRef(null);

  return (
    <>
      <div ref={portalContainerRef} />
      <Box display="flex" gap="1rem" minW="fit-content" justifyContent="center" alignItems="center">
        <Box display="flex" flexFlow="column" alignItems="flex-start" paddingX="0.5rem">
          <Text>{txError.getPrettyMsg()}</Text>
          <Tooltip
            label="Copied!"
            sx={{ zIndex: 100000, position: "relative" }}
            hasArrow={true}
            isOpen={hasCopied}
            portalProps={{ containerRef: portalContainerRef }}
          >
            <Button bgColor="wynd.alert.error.200" onClick={onCopy} size="xs" marginTop={1} p={1}>
              <Flex p={1} alignItems="center" justifyContent="space-between">
                <Icon fontSize="xs" as={FiCopy} />
                <Text marginLeft={1}>
                  Copy full error to clipboard
                </Text>
              </Flex>
            </Button>
          </Tooltip>
        </Box>
        <Box
          as="button"
          onClick={() => toast.dismiss("tx.error")}
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
    </>
  );
}
