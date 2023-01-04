import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

interface OnRampModalOptions {
  onClose: () => void;
  isOpen: boolean;
}

export default function OnRampModal({ onClose, isOpen }: OnRampModalOptions) {
  const { address: walletAddress } = useWallet();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent
        maxW={{ md: "2xl" }}
        borderRadius="2xl"
        p={2}
        mx={2}
        bgColor="white"
        height="100%"
        maxHeight="724px"
      >
        <ModalCloseButton sx={{ color: "black", marginRight: 2 }} />
        <iframe
          title="Kado app"
          src={`https://app.kado.money/?apiKey=b4995f6d-a443-4729-8c22-4f6ae70deb17&onPayCurrency=USD&onRevCurrency=USDC&product=BUY&network=JUNO&cryptoList=USDC&onToAddress=${
            walletAddress ?? ""
          }`}
          height={700}
          style={{ marginTop: "24px" }}
        ></iframe>
      </ModalContent>
    </Modal>
  );
}
