import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
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
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxW={{ md: "2xl" }} borderRadius="2xl" p={6} mx={2} bgColor="wynd.base.subBg">
        <ModalHeader fontSize="2xl" fontWeight="bold" p={0} mb={6}>
          Legal Disclaimer
        </ModalHeader>
        <Text fontSize="xl" mb={3}>
          The information provided on this website does not constitute investment advice, financial advice,
          trading advice, or any other sort of advice and you should not treat any of the content as such.
          <br />
          <br /> WYND provides all information “as is”. WYND makes no representations as to the accuracy,
          completeness, timeliness, suitability, or validity of any information on this website and will not
          be liable for any errors, omissions, or delays in this information or any losses, injuries, or
          damages arising from its display or use. You understand that you are using any and all information
          available on this website at your own risk.
          <br />
          <br /> The appearance of third party advertisements and hyperlinks on this website does not
          constitute an endorsement, guarantee, warranty, or recommendation by WYND. You should make decisions
          based on your independent judgment and/or engage your own advisors before deciding to use any third
          party services.
        </Text>
        <Button onClick={() => setModalOpen(false)}>I understand</Button>
      </ModalContent>
    </Modal>
  );
}
