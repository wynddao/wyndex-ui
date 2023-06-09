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
    Select,
    Checkbox,
    Flex,
} from '@chakra-ui/react';

import React from "react";

import { getAssetList } from '../../../utils/getAssetList';
import { AssetInfo, DistributionFlow } from '../../../state/clients/types/WyndexFactory.types';

const EditDistributionFlowModal = ({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const assets = getAssetList().tokens;

    const [elements, setElements] = React.useState([
        { isCW20: false, cw20Address: '', nativeToken: '', rewardDuration: '' }
    ]);

    const formGroup = (element: any, index: number) => {
        return (
            <>
                <Flex align="center" justify="space-between">
                    <Checkbox
                      mb='8px'
                      isChecked={element.isCW20}
                      onChange={() => handleCheckboxChange(index)}
                    >
                        CW20
                    </Checkbox>
                    <Button 
                      size="xs"
                      colorScheme="red"
                      onClick={() => handleRemoveElement(index)}
                    >
                        Remove
                    </Button>
                </Flex>
                {!element.isCW20 ?
                    <Select 
                      placeholder='Select Native'
                      onChange={(event) => handleDropdownChange(index, event)}
                      value={elements[index].nativeToken}
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
                      value={elements[index].cw20Address}
                      mb='8px'
                    ></Input>
                }
                    <Input
                      placeholder='Reward Duration'
                      type="number"
                      onChange={(event) => handleDurationInputChange(index, event)}
                      value={elements[index].rewardDuration}
                      mb='24px'
                    ></Input>
            </>
        )
    };

    const handleCheckboxChange = (index: number) => {
        const updatedElements = [...elements];
        updatedElements[index].isCW20 = !elements[index].isCW20;
        setElements(updatedElements);
    };

    const handleDropdownChange = (index: number, event: any) => {
        const updatedElements = [...elements];
        updatedElements[index].nativeToken = event.target.value;
        setElements(updatedElements);
    };

    const handleInputChange = (index: number, event: any) => {
        const updatedElements = [...elements];
        updatedElements[index].cw20Address = event.target.value;
        setElements(updatedElements);
    };

    const handleDurationInputChange = (index: number, event: any) => {
        const updatedElements = [...elements];
        updatedElements[index].rewardDuration = event.target.value;
        setElements(updatedElements);
    };

    const handleAddAnother = () => {
        setElements([...elements, { isCW20: false, cw20Address: '', nativeToken: '', rewardDuration: '' }]);
    };

    const handleRemoveElement = (index: any) => {
        const updatedElements = elements.filter((_, idx) => idx !== index);
        setElements(updatedElements);
    };

    const createAsset = (element: any) => {
        let obj: any = {};

        if(element.isCW20) {
            obj.token = element.cw20Address;
        } else {
            obj.native = element.nativeToken;
        }

        return obj;
    };

    const handleApply = async () => {
        const distributionFlows: DistributionFlow[] =  elements.map((element) => ({
            asset: createAsset(element),
            reward_duration: 604800,
            rewards: [
                [604800, "1.0"],
                [604800, "2.0"],
                [604800, "4.0"],
                [604800, "6.0"],
            ]
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Edit Distribution Flow</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {elements.map((element, index) => (
                    formGroup(element, index)
                ))}
                <Button 
                  onClick={handleAddAnother}
                  variant="outline"
                >
                    Add another
                </Button>
            </ModalBody>

            <ModalFooter>
                <Button 
                  onClick={handleApply}
                >
                    Apply
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
};

export default EditDistributionFlowModal;