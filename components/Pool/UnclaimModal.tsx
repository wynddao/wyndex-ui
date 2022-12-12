"use client";

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useToast, WyndexStakeHooks } from "../../state";
import { microamountToAmount, microcoinToCoin } from "../../utils/tokens";

interface ManageLiquidityProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly totalUnstakingAvailable: number;
  readonly wyndexStakeAddress: string;
  readonly refresh: () => void;
  readonly tokenSymbol: any;
}

export default function UnclaimModal({
  isOpen,
  onClose,
  totalUnstakingAvailable,
  wyndexStakeAddress,
  refresh,
  tokenSymbol,
}: ManageLiquidityProps) {
  const { address: walletAddress } = useWallet();
  const { txToast } = useToast();
  const doClaim = WyndexStakeHooks.useClaim({
    contractAddress: wyndexStakeAddress,
    sender: walletAddress || "",
  });
  const claim = async () => {
    await txToast(doClaim);
    onClose();
    // New balances will not appear until the next block.
    await new Promise((resolve) => setTimeout(resolve, 6500));
    refresh();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim Unstaked LP Tokens</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Total available: {microamountToAmount(totalUnstakingAvailable, 6)} {tokenSymbol}
          </Text>
          <Flex justifyContent="end">
            <Button onClick={() => claim()}>Claim now!</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
