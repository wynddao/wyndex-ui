"use client";

import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  Image,
  Text,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { dataType } from ".";
import TokenDropdown from "./TokenDropdown";
import { useTranslation } from "i18next-ssg";
interface SelectTokenProps {
  readonly tokens: dataType[];
  readonly selectedToken: dataType;
  readonly selectToken: (value: dataType) => void;
}

export default function SelectToken({ tokens, selectedToken, selectToken }: SelectTokenProps) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation("common");
  const selectMenuRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick({ ref: selectMenuRef, handler: () => onClose() });

  return (
    <Flex
      flexDirection="column"
      ref={selectMenuRef}
      position="relative"
      bg={"wynd.neutral.200"}
      borderRadius="xl"
      boxShadow={isOpen ? "0 0 20px -8px rgba(0,0,0, 0.5)" : "none"}
      gap={2}
    >
      <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="bold">
        {t("pool.chooseAsset")}
      </Text>
      <Flex align="center" maxW="full" h="fit-content">
        <Button
          flex={2}
          variant="unstyled"
          w="fit-content"
          h="fit-content"
          whiteSpace="normal"
          _focus={{ boxShadow: "none" }}
          onClick={onToggle}
          mr={2}
        >
          <Flex align="center">
            <Box
              minW={{ base: 12, sm: 20 }}
              minH={{ base: 12, sm: 20 }}
              maxW={{ base: 12, sm: 20 }}
              maxH={{ base: 12, sm: 20 }}
              w="full"
              h="full"
              borderRadius="full"
              border="2px solid"
              borderColor="orange.300"
              mr={{ base: 2, sm: 4 }}
            >
              <Image alt={`${selectedToken.label} logo`} src={selectedToken.imgSrc} />
            </Box>
            <Text fontSize={{ base: "xl", sm: "2xl" }} fontWeight="bold" textAlign="start">
              {selectedToken.label}&nbsp;
            </Text>
            <Icon
              as={isOpen ? FiChevronUp : FiChevronDown}
              fontSize={{ base: "xl", sm: "2xl" }}
              color={"wynd.neutral.800"}
            />
          </Flex>
        </Button>
      </Flex>
      <Box
        position="absolute"
        zIndex={2000}
        bg={"wynd.neutral.200"}
        boxShadow={isOpen ? "0 12px 20px -8px rgba(0,0,0, 0.5)" : "none"}
        borderRadius="xl"
        left={0}
        right={0}
        px={6}
      >
        <Collapse in={isOpen} animateOpacity>
          <Box py={6}>
            <TokenDropdown
              tokens={tokens}
              selectedToken={selectedToken}
              selectToken={selectToken}
              onClose={onClose}
            />
          </Box>
        </Collapse>
      </Box>
    </Flex>
  );
}
