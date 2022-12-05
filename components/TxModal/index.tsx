"use client";

import {
  Center,
  HStack,
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
import { TxError } from "../../utils/txError";
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
        <ModalHeader>{txModalState.loading && "Your Transaction"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center padding={"1rem"}>
            <TxModalContent txModalState={txModalState} />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const TxModalContent = ({ txModalState }: { txModalState: TxModalState }) => {
  if (txModalState.loading) {
    return <Spinner size="xl" />;
  }

  if (txModalState.error) {
    return <p>Error: {new TxError(txModalState.error).pretty()}</p>;
  }

  return (
    <SimpleGrid columns={1}>
      <Image src={druidImage} alt="druidSuccess" />
      <Center>
        <Text fontSize="3xl">Success!</Text>
      </Center>
      <Center>
        <Link className="link" maxWidth={"90%"} href={EXPLORER_URL + txModalState.txHash} target="_blank">
          <HStack color="orange.300" maxW="100%">
            {txModalState.txHash}
            <FaExternalLinkAlt />
          </HStack>
        </Link>
      </Center>
    </SimpleGrid>
  );
};
