"use client";

import {
  Center,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { txModalAtom, TxModalState } from "../../state/recoil/atoms/txModal";
import { EXPLORER_URL } from "../../utils";
import druidImage from "./assets/druid.gif";

export default function TxModal() {
  const [txModalState, setTxModalState] = useRecoilState(txModalAtom);
  const closeTxModal = () => {
    setTxModalState({ ...txModalState, active: false });
  };
  return (
    <Modal isOpen={txModalState.active} onClose={() => closeTxModal()} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        {txModalState.loading && <ModalHeader>Your Transaction</ModalHeader>}
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
    <SimpleGrid columns={1}>
      <Image src={druidImage} alt="druidSuccess" />
      <Center>
        <Text fontSize="3xl">Success!</Text>
      </Center>
      <Center>
        <Link maxWidth={"90%"} href={EXPLORER_URL + txModalState.txHash} target="_blank">
          <Text color="orange.300" noOfLines={1} maxW="100%">
            {txModalState.txHash}
            <FaExternalLinkAlt />
          </Text>
        </Link>
      </Center>
    </SimpleGrid>
  );
};
