"use client";
import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

interface OnRampModalOptions {
  onClose: () => void;
  isOpen: boolean;
}

export default function OnRampModal({ onClose, isOpen }: OnRampModalOptions) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent maxW={{ md: "2xl" }} borderRadius="2xl" p={6} mx={2} bgColor="wynd.base.subBg">
        <ModalHeader fontSize="2xl" fontWeight="bold" p={0} mb={6}>
          OnRamp Fiat
        </ModalHeader>
        <ModalCloseButton top={6} right={6} />
        <iframe
          src="https://app.kado.money/?apiKey=API_KEY&onPayCurrency=USD&onRevCurrency=USDC&product=BUY&networkList=JUNO&cryptoList=USDC"
          width="100%"
          height="700"
          style={{ border: 0 }}
        ></iframe>
      </ModalContent>
    </Modal>
  );
}
