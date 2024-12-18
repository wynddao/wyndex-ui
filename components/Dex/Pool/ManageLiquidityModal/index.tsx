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
import { Suspense, useState } from "react";
import { useCw20UserInfos, UseTokenNameResponse } from "../../../../state";
import { PairInfo, PoolResponse } from "../../../../state/clients/types/WyndexPair.types";
import AddLiquidity from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";

const tabName = ["Add Liquidity", "Remove Liquidity"];

interface ManageLiquidityProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpenBondings: () => void;
  readonly data: PairInfo;
  readonly poolData: PoolResponse;
  readonly walletAddress: string;
}

export default function ManageLiquidity({
  isOpen,
  onClose,
  onOpenBondings,
  data,
  poolData,
  walletAddress,
}: ManageLiquidityProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const { balance: lpBalance, refreshBalance: refreshLpBalance } = useCw20UserInfos(data.liquidity_token);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent bgColor="wynd.base.subBg">
        <ModalHeader>Manage Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Suspense fallback={<p>Loading...</p>}>
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
                  <AddLiquidity
                    data={data}
                    poolData={poolData}
                    refreshLpBalance={refreshLpBalance}
                    onClose={() => {
                      onClose();
                      onOpenBondings();
                    }}
                  />
                </TabPanel>
                <TabPanel>
                  <RemoveLiquidity
                    refreshLpBalance={refreshLpBalance}
                    poolData={poolData}
                    onClose={onClose}
                    pairData={data}
                    availableTokens={Number(lpBalance)}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Suspense>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
