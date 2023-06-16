import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Text,
  Checkbox,
  Flex,
  Select,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";

import { createPairAndDistributionFlows } from "../../../state/hooks/clients/WyndexFactory";
import { AssetInfo, DistributionFlow } from "../../../state/clients/types/WyndexFactory.types";

import React from "react";
import { useIndexerInfos, useToast } from "../../../state";
import { ExecuteResult, toBase64, toUtf8 } from "cosmwasm";

import { create } from "domain";
import { string } from "zod";
import { FACTORY_CONTRACT_ADDRESS, WYND_TOKEN_ADDRESS } from "../../../utils";
import { getAssetList } from "../../../utils/getAssetList";
import { useSend } from "../../../state/hooks/clients/Cw20";

const CreatePoolModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { address: walletAddress, connect, isWalletConnected } = useChain("juno");
  const { txToast } = useToast();
  const assetList = getAssetList().tokens;
  const assets = assetList.filter((asset) => {
    if (asset.tags === "ibc" || asset.tags === "native") return asset;
  });

  const [tokens, setTokens] = React.useState([
    { isCW20: false, cw20Address: "", nativeToken: "" },
    { isCW20: false, cw20Address: "", nativeToken: "" },
  ]);

  const createPair = createPairAndDistributionFlows({
    contractAddress: FACTORY_CONTRACT_ADDRESS,
    sender: walletAddress || "",
  });

  const sendCW20 = useSend({
    contractAddress: WYND_TOKEN_ADDRESS,
    sender: walletAddress || "",
  });

  const createAssetInfo = (token: any) => {
    let obj: any = {};

    if (token.isCW20) {
      obj.token = token.cw20Address;
    } else {
      obj.native = token.nativeToken;
    }

    return obj;
  };

  const handleCreatePool = async () => {
    const assetInfos: AssetInfo[] = [createAssetInfo(tokens[0]), createAssetInfo(tokens[1])];

    const distributionFlows: DistributionFlow[] = [
      {
        asset: {
          native: "ujuno",
        },
        reward_duration: 604800,
        rewards: [
          [604800, "1.0"],
          [1209600, "2.0"],
          [2419200, "4.0"],
          [3628800, "6.0"],
        ],
      },
    ];

    await txToast(async (): Promise<ExecuteResult> => {
      const result = await sendCW20({
        amount: "1000000000",
        contract: FACTORY_CONTRACT_ADDRESS,
        msg: toBase64(
          toUtf8(
            JSON.stringify({
              create_pair: {
                asset_infos: assetInfos,
                distribution_flows: distributionFlows,
                pair_type: {
                  xyk: {},
                },
              },
            }),
          ),
        ),
      });

      await new Promise((resolve) => setTimeout(resolve, 6500));
      return result;
    });
  };

  const handleCheckboxChange = (index: number) => {
    const updatedElements = [...tokens];
    updatedElements[index].isCW20 = !tokens[index].isCW20;
    setTokens(updatedElements);
  };

  const handleDropdownChange = (index: number, event: any) => {
    const updatedElements = [...tokens];
    updatedElements[index].nativeToken = event.target.value;
    setTokens(updatedElements);
  };

  const handleInputChange = (index: number, event: any) => {
    const updatedElements = [...tokens];
    updatedElements[index].cw20Address = event.target.value;
    setTokens(updatedElements);
  };

  const formGroup = (element: any, index: number) => {
    return (
      <>
        <Checkbox mb="8px" isChecked={element.isCW20} onChange={() => handleCheckboxChange(index)}>
          CW20
        </Checkbox>
        {!element.isCW20 ? (
          <Select
            placeholder="Select Native"
            onChange={(event) => handleDropdownChange(index, event)}
            value={tokens[index].nativeToken}
            mb="8px"
          >
            {assets.map((asset, i) => {
              return (
                <option key={i} value={asset.denom}>
                  {asset.symbol}
                </option>
              );
            })}
          </Select>
        ) : (
          <Input
            placeholder="CW20 Address"
            onChange={(event) => handleInputChange(index, event)}
            value={tokens[index].cw20Address}
            mb="8px"
          ></Input>
        )}
      </>
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new Pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{tokens.map((token, index) => formGroup(token, index))}</ModalBody>

          <ModalFooter>
            <Button onClick={handleCreatePool}>Create Pool</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePoolModal;
