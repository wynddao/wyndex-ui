import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { toBase64, toUtf8 } from "cosmwasm";
import { useState } from "react";
import { useToast } from "../../../state";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { useSend } from "../../../state/hooks/clients/Cw20";
import { WYND_TOKEN_ADDRESS } from "../../../utils";

interface AddOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  gauge: GaugeResponse;
}

export default function AddOptionModal(props: AddOptionModalProps) {
  const { isOpen, onClose, walletAddress, gauge } = props;
  const { txToast, isTxLoading } = useToast();
  const [url, setUrl] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [address, setAddress] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendCW20 = useSend({
    contractAddress: WYND_TOKEN_ADDRESS,
    sender: walletAddress || "",
  });

  const submit = async () => {
    return await sendCW20({
      amount: "10000000",
      contract: gauge.adapter,
      msg: toBase64(toUtf8(JSON.stringify({ create_submission: { name, url, address } }))),
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    // Check inputs
    if (!name || !url || !address) {
      setIsLoading(false);
      return;
    }

    // Check regex if url is valid
    const regex = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    ); // fragment locator
    if (!regex.test(url)) {
      setIsLoading(false);
      return;
    }

    // Check if address starts with "juno1"
    if (!address.startsWith("juno1")) {
      setIsLoading(false);
      return;
    }

    // Submit
    await txToast(submit);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent bgColor="wynd.base.subBg">
        <ModalHeader>Add Option</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="1fr 1fr" gap={2}>
            <Text>Title*</Text>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Title" />
            <Box my={2}>
              <Text>Link*</Text>
              <Text fontSize="sm">
                Valid URLs must look like <strong>https://yourUrl.com/</strong>
              </Text>
            </Box>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link" />
            <Text>Juno Address*</Text>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Juno1wyndwyndwyndwynd"
            />
          </Grid>
          <Flex justifyContent="flex-end">
            <Text fontSize="xs" color="wynd.gray.500">
              * Required
            </Text>
          </Flex>
          <Divider my={4} />
          <Alert status="info">
            <Text fontSize="sm">Please note that you have to deposit 10 WYND for a submission.</Text>
          </Alert>
          <Flex justifyContent="flex-end" my={4}>
            <Button isLoading={isLoading} onClick={() => onSubmit()}>
              Submit
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
