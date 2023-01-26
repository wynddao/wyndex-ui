"use client";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { OptionBase } from "chakra-react-select";
import { useState } from "react";
import SelectToken from "./SelectToken";
import { poolOptionTokens } from "./__mocks__/newPool";

export interface dataType extends OptionBase {
  label?: string;
  value?: string;
  imgSrc?: string;
  ibc?: {
    source_channel?: string;
    dst_channel?: string;
    source_denom?: string;
  };
}

interface CreatePoolModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function CreatePoolModal({ isOpen, onClose }: CreatePoolModalProps) {
  const [selectedTokenA, setSelectedTokenA] = useState<dataType>(poolOptionTokens[0]);
  const [selectedTokenB, setSelectedTokenB] = useState<dataType>(poolOptionTokens[1]);

  const tokensToSelect = poolOptionTokens.filter(
    (token) => token.label !== selectedTokenA?.label && token.label !== selectedTokenB?.label,
  );

  // TODO: Query pair to see if already there
  const poolAlreadyExists = Math.random() < 0.5;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Pool</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={4}>
            <SelectToken
              tokens={tokensToSelect}
              selectedToken={selectedTokenA}
              selectToken={setSelectedTokenA}
            />
            <SelectToken
              tokens={tokensToSelect}
              selectedToken={selectedTokenB}
              selectToken={setSelectedTokenB}
            />
            {poolAlreadyExists ? (
              <Flex justify="center" mb={6}>
                <Alert status="error" borderRadius="md" w="fit-content">
                  <AlertIcon />
                  <AlertTitle>That pool already exists</AlertTitle>
                </Alert>
              </Flex>
            ) : null}
            <Button type="submit" disabled={poolAlreadyExists}>
              Create
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
