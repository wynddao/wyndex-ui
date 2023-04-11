import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { startTransition } from "react";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import {
  getBalanceByAsset,
  useIndexerInfos,
  useToast,
  UseTokenNameResponse,
  WyndexStakeHooks,
} from "../../../state";
import { PairInfo } from "../../../state/clients/types/WyndexFactory.types";
import { getAssetByInfo } from "../../../utils/assets";
import { microamountToAmount } from "../../../utils/tokens";

interface UnclaimModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly totalUnstakingAvailable: number;
  readonly wyndexStakeAddress: string;
  readonly refreshPendingUnstaking: () => void;
  readonly tokenInfo: UseTokenNameResponse;
  readonly pairData: PairInfo;
}

export default function UnclaimModal({
  isOpen,
  onClose,
  totalUnstakingAvailable,
  wyndexStakeAddress,
  refreshPendingUnstaking,
  tokenInfo,
  pairData,
}: UnclaimModalProps) {
  const { address: walletAddress } = useChain("juno");
  const { refreshIbcBalances, refreshCw20Balances } = useIndexerInfos({});

  const assetASelector = getBalanceByAsset({
    address: walletAddress || "",
    asset: getAssetByInfo(pairData.asset_infos[0]),
  });
  const assetBSelector = getBalanceByAsset({
    address: walletAddress || "",
    asset: getAssetByInfo(pairData.asset_infos[1]),
  });
  const refreshBalanceA = useRecoilRefresher_UNSTABLE(assetASelector);
  const refreshBalanceB = useRecoilRefresher_UNSTABLE(assetBSelector);

  const { txToast } = useToast();
  const doClaim = WyndexStakeHooks.useClaim({
    contractAddress: wyndexStakeAddress,
    sender: walletAddress || "",
  });
  const claim = async () => {
    await txToast(doClaim);
    onClose();
    // New balances will not appear until the next block.
    await new Promise((resolve) => setTimeout(resolve, 6500));
    const hasCw20 = !!pairData.asset_infos.find((info) => "token" in info);
    const hasNative = !!pairData.asset_infos.find((info) => "native" in info);
    //FIXME - This startTransition does not work
    startTransition(() => {
      refreshBalanceA();
      refreshBalanceB();
      refreshPendingUnstaking();

      if (hasCw20) refreshCw20Balances();
      if (hasNative) refreshIbcBalances();
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim Unstaked LP Tokens</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Total available: {microamountToAmount(totalUnstakingAvailable, tokenInfo.tokenDecimals)}{" "}
            {tokenInfo.tokenSymbol}
          </Text>
          <Flex justifyContent="end">
            <Button onClick={() => claim()}>Claim now!</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
