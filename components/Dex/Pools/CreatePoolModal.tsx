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

const CreatePoolModal = ({
    isOpen,
    onClose
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    const { address: walletAddress, connect, isWalletConnected } = useChain("juno");
    const { txToast } = useToast();

    const [firstAddress, setFirstAddress] = React.useState('');
    const [secondAddress, setSecondAddress] = React.useState('');

    const handleFirstAddress = (event: any) => setFirstAddress(event.target.value);
    const handleSecondAddress = (event: any) => setSecondAddress(event.target.value);

    const createPair = createPairAndDistributionFlows({
        contractAddress: FACTORY_CONTRACT_ADDRESS,
        sender: walletAddress || "",
    });

    const createAssetInfo = (address: string) => {
        let obj: any = {};

        if(address.startsWith("ujuno") || address.startsWith("ibc")) {
            obj.native = address;
        } else if(address.startsWith("juno")) {
            obj.token = address;
        }

        return obj;
    };

    const handleCreatePool = async () => {
        const assetInfos: AssetInfo[] = [
            createAssetInfo(firstAddress),
            createAssetInfo(secondAddress),
        ];

        const distributionFlows: DistributionFlow[] = [{
            asset: {
                native: 'ujuno'
            },
            reward_duration: 604800,
            rewards: [
                [604800, "1.0"],
                [604800, "2.0"],
                [604800, "4.0"],
                [604800, "6.0"],
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

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Create new Pool</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>First Address</Text>
                    <Input
                        mb='8px'
                        value={firstAddress}
                        onChange={handleFirstAddress}
                    />

                    <Text>Second Address</Text>
                    <Input
                        mb='8px'
                        value={secondAddress}
                        onChange={handleSecondAddress}
                    />
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