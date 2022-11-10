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
import Image from "next/image";
import keplrLogo from "../public/keplr-logo.png";
import walletConnectLogo from "../public/walletconnect-logo.png";

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
        <ModalBody px={6} pt={0} pb={6}>
          {walletManager.wallets.map(({ walletName, walletPrettyName }) => (
            <Button
              key={walletName}
              colorScheme="blue"
              variant="ghost"
              onClick={() => selectWallet(walletName)}
              w="full"
              h="auto"
              p={4}
              justifyContent="flex-start"
              gap={4}
            >
              <Image
                alt={`${walletPrettyName} logo`}
                src={walletName === "keplr-extension" ? keplrLogo : walletConnectLogo}
                style={{ width: "100%", height: "auto", maxWidth: "64px", maxHeight: "64px" }}
              />
              <Text>{walletPrettyName}</Text>
            </Button>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
