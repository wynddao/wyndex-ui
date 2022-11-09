"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { WalletModalProps } from "@cosmos-kit/core";
import { useWallet } from "@cosmos-kit/react";

export default function ConnectWalletModal({ isOpen, setOpen }: WalletModalProps) {
  const walletManager = useWallet();

  async function selectWallet(walletName: string) {
    console.info("Connecting: " + walletName);
    walletManager.setCurrentWallet(walletName);
    await walletManager.connect();
    console.info("Connected: " + walletName);
    walletManager.closeView();
  }

  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={() => setOpen(false)}>
      <ModalContent>
        <ModalHeader>Select a wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {walletManager.wallets.map(({ walletName, walletPrettyName }) => (
            <Button
              key={walletName}
              colorScheme="blue"
              variant="ghost"
              onClick={() => selectWallet(walletName)}
              w="full"
            >
              <Text>{walletPrettyName}</Text>
            </Button>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
