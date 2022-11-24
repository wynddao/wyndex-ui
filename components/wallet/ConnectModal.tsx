import { Modal, ModalContent, ModalOverlay, Stack } from '@chakra-ui/react';
import React from 'react';

import { ConnectModalType } from '../../types';

export const ConnectModal = ({
  modalHead,
  modalContent,
  modalIsOpen,
  modalOnClose
}: ConnectModalType) => {
  return (
    <Modal isOpen={modalIsOpen} onClose={modalOnClose}>
      <ModalOverlay />
      <ModalContent
        display="flex"
        borderRadius="lg"
        w="full"
        h="auto"
        alignSelf="center"
        maxW={96}
        minH={80}
        mx={4}
        _focus={{ outline: 'none' }}
      >
        <Stack flex={1} spacing={0} h="full">
          {modalHead}
          {modalContent}
        </Stack>
      </ModalContent>
    </Modal>
  );
};
