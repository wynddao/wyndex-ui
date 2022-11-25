"use client";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";
import { Pair } from "../../utils/types";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";

const tabName = ["Add Liquidity", "Remove Liquidity"];

interface ManageLiquidityProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly poolData: Pair;
}

export default function ManageLiquidity({ isOpen, onClose, poolData }: ManageLiquidityProps) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs isFitted={true} colorScheme="primary" onChange={(index) => setTabIndex(index)} mb={6}>
            <TabList mb="1em">
              {tabName.map((name, index) => (
                <Tab
                  key={index}
                  _hover={{ color: index !== tabIndex && "primary.300" }}
                  _focus={{ outline: "none" }}
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <AddLiquidity poolData={poolData} onClose={onClose} />
              </TabPanel>
              <TabPanel>
                <RemoveLiquidity />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
