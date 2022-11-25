"use client";

import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { txModalAtom, TxModalState } from "../../state/recoil/atoms/txModal";

export default function TxModal() {
  const [txModalState, setTxModalState] = useRecoilState(txModalAtom);
  const closeTxModal = () => {
    setTxModalState({ ...txModalState, active: false });
  };
  return (
    <Modal isOpen={txModalState.active} onClose={() => closeTxModal()} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TxModalContent txModalState={txModalState} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const TxModalContent = ({ txModalState }: { txModalState: TxModalState }) => {
  if (txModalState.loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (txModalState.error) {
    return (
      <Center>
        <p>Error: {txModalState.error}</p>
      </Center>
    );
  }
  return (
    <Center>
      <p>TxHash: {txModalState.txHash}</p>
    </Center>
  );
};
