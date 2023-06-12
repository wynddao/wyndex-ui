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
} from '@chakra-ui/react'
import { useChain } from "@cosmos-kit/react-lite";

import { createPairAndDistributionFlows } from "../../../state/hooks/clients/WyndexFactory";
import { AssetInfo, DistributionFlow } from '../../../state/clients/types/WyndexFactory.types';

import React from "react";
import { useToast } from '../../../state';
import { ExecuteResult } from "cosmwasm";

import { create } from 'domain';
import { string } from 'zod';
import { FACTORY_CONTRACT_ADDRESS } from '../../../utils';
import { getAssetList } from '../../../utils/getAssetList';

const CreatePoolModal = ({
    isOpen,
    onClose
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    const { address: walletAddress, connect, isWalletConnected } = useChain("juno");
    const { txToast } = useToast();
    const assets = getAssetList().tokens.filter((asset) => {
        if(asset.tags === "ibc") return asset;
    });

    const [tokens, setTokens] = React.useState([
        { isCW20: false, cw20Address: '', nativeToken: '' },
        { isCW20: false, cw20Address: '', nativeToken: '' },
    ]);

    const createPair = createPairAndDistributionFlows({
        contractAddress: FACTORY_CONTRACT_ADDRESS,
        sender: walletAddress || "",
    });

    const createAssetInfo = (token: any) => {
        let obj: any = {};

        if(token.isCW20) {
            obj.token = token.cw20Address;
        } else {
            obj.native = token.nativeToken;
        }

        return obj;
    };

    const handleCreatePool = async () => {
        const assetInfos: AssetInfo[] = [
            createAssetInfo(tokens[0]),
            createAssetInfo(tokens[1]),
        ];

        const distributionFlows: DistributionFlow[] = [{
            asset: {
                native: 'ujuno'
            },
            reward_duration: 604800,
            rewards: [
                [604800, "1.0"],
                [1209600, "2.0"],
                [2419200, "4.0"],
                [3628800, "6.0"],
            ]
        }];
        
        await txToast(async (): Promise<ExecuteResult> => {
            const result = await createPair({
                assetInfos: assetInfos,
                distributionFlows: distributionFlows,
                pairType: {
                    xyk: {}
                }
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
                <Checkbox
                  mb='8px'
                  isChecked={element.isCW20}
                  onChange={() => handleCheckboxChange(index)}
                >
                    CW20
                </Checkbox>
                {!element.isCW20 ?
                    <Select 
                      placeholder='Select Native'
                      onChange={(event) => handleDropdownChange(index, event)}
                      value={tokens[index].nativeToken}
                      mb='8px'
                    >
                        {assets.map((asset, i) => {
                            return <option key={i} value={asset.denom}>{asset.symbol}</option>
                        })}
                    </Select>
                    :
                    <Input
                      placeholder='CW20 Address'
                      onChange={(event) => handleInputChange(index, event)}
                      value={tokens[index].cw20Address}
                      mb='8px'
                    ></Input>
                }
            </>
        )
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Create new Pool</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {tokens.map((token, index) => (
                        formGroup(token, index)
                    ))}
                </ModalBody>

                <ModalFooter>
                    <Button onClick={handleCreatePool}>Create Pool</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
  }

export default CreatePoolModal;