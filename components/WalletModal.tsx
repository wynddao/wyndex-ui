import * as React from "react";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation-extension";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapwallets } from "@cosmos-kit/leap-extension";
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/react";
import { MainWalletBase } from "@cosmos-kit/core";
import Image from "next/image";

// Define Modal Component
const MyModal = ({ isOpen, setOpen, walletRepo, theme }: any) => {
  function onCloseModal() {
    setOpen(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalContent>
        <ModalHeader>Choose Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {[...keplrWallets, ...leapwallets, ...cosmostationWallets].map((wallet: MainWalletBase) => {
            const walletLogo =
              typeof wallet.walletInfo.logo === "string"
                ? wallet.walletInfo.logo
                : wallet.walletInfo.logo?.minor;
            return (
              <Button
                key={wallet.walletInfo.name}
                colorScheme="blue"
                variant="ghost"
                sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => wallet.connectAll()}
              >
                {walletLogo && (
                  <Image src={walletLogo} width="32" height="32" alt={wallet.walletInfo.prettyName} />
                )}
                {wallet.walletInfo.prettyName}
              </Button>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { MyModal };
