import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { tosModalAtom } from "../state/recoil/atoms/modal";

export default function ToSModal() {
  const [modalOpen, setModalOpen] = useRecoilState(tosModalAtom);
  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      blockScrollOnMount={false}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent maxW={{ md: "2xl" }} borderRadius="2xl" p={6} mx={2} bgColor="wynd.base.subBg">
        <ModalHeader fontSize="2xl" fontWeight="bold" p={0} mb={6}>
          Hi all!
        </ModalHeader>
        <ModalCloseButton top={6} right={6} />
        <Text fontSize="xl" mb={3}>
          {`Thank you for visiting our DEX in beta! We are so grateful for your early support. Our amazing team
          and everybody who helped us build this DEX in such a short amount of time deserve a round of
          applause!`}
          <br />
          <br />
          {`We've worked hard to make sure the DEX is as functional as possible, but we know there are
          still some bugs that need to be ironed out. If you encounter any issues while using our DEX, please
          report them in the dedicated issue tracker on GitHub.`}
          <br />
          <br />
          Your feedback is invaluable in helping us make sure the DEX runs smoothly. Thank you again for your
          support and understanding!
          <br />
          <br />
          Much love, the WYND Druid. {"🍃"}
        </Text>
      </ModalContent>
    </Modal>
  );
}
