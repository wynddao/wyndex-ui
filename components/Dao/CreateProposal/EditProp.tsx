import { Box, Button, Flex, Grid, GridItem, Input, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { unknown } from "zod";
import { FormError } from ".";
import { MsgType } from "../Actions/types";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { ActionItem } from "./ActionItem";
import { useTranslation } from "i18next-ssg";

interface CreateProposalProps {
  msgs: MsgType[];
  setMsgs: (msgs: MsgType[]) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  setTabIndex: (n: number) => void;
  error: FormError;
  preview: boolean;
}

export const EditProp = ({
  msgs,
  setMsgs,
  title,
  setTitle,
  description,
  setDescription,
  setTabIndex,
  error,
  preview,
}: CreateProposalProps) => {
  const addNewMsg = () => {
    const _msgs: MsgType[] = [
      ...msgs,
      {
        type: unknown,
        msg: "",
        msgBeautified: "{}",
        contract_addr: "",
        rawMsg: { msg: { wasm: {} } },
      },
    ];
    setMsgs(_msgs);
  };

  const deleteMsg = (id: number) => {
    const _msgs: MsgType[] = [...msgs];
    _msgs.splice(id, 1);
    setMsgs(_msgs);
  };

  const changeMsg = (id: number, msg: MsgType) => {
    let _msgs: MsgType[] = [...msgs];
    _msgs[id] = msg;
    setMsgs(_msgs);
  };
  const { t } = useTranslation("common");
  return (
    <>
      <Grid templateColumns="1fr 3fr 1fr">
        <GridItem colStart={2} colSpan={1}>
          <Text
            fontSize="2xl"
            bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
            bgClip="text"
            display="inline"
          >
            {t("general.general")}
          </Text>
          <BorderedBox mb={4}>
            <Grid templateColumns="1fr 1fr">
              <Flex alignItems="center">
                <Text>{t("proposal.proposalTitle")}</Text>
              </Flex>
              <Input
                isInvalid={error.title}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid mt={3} templateColumns="1fr 1fr">
              <Flex alignItems="center">
                <Text>{t("proposal.proposalDescription")}</Text>
              </Flex>
              <Textarea
                isInvalid={error.desc}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </BorderedBox>
          <Text
            fontSize="2xl"
            bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
            bgClip="text"
            display="inline"
          >
            {t("general.actions")}
          </Text>
          <BorderedBox>
            <Flex
              border="1px solid"
              borderColor="wynd.gray.500"
              justifyContent="center"
              alignItems="center"
              w="100%"
              borderRadius="xl"
              onClick={() => addNewMsg()}
              h="50px"
              _hover={{ cursor: "pointer", color: "wynd.gray.700", borderColor: "wynd.gray.700" }}
            >
              <AiOutlinePlusSquare size="32" />
            </Flex>
            {msgs.map((msg, id) => {
              return (
                <Box
                  borderRadius="xl"
                  mt={2}
                  key={id}
                  border="1px solid"
                  borderColor="wynd.gray.500"
                  justifyContent="center"
                  alignItems="center"
                >
                  <ActionItem changeMsg={changeMsg} deleteMsg={deleteMsg} id={id} msg={msg} />
                </Box>
              );
            })}
          </BorderedBox>
          <Box w="100%" mt={3}>
            <Button disabled={preview} w="100%" onClick={() => setTabIndex(1)}>
              {t("proposal.previewProposal")}
            </Button>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};
