import {
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDaoStakingInfos } from "../../../state/hooks/useDaoStakingInfos";
import { MsgType } from "../Actions/types";
import { EditProp } from "./EditProp";
import { CreateProposalHeader } from "./Header";
import { Preview } from "./Preview";
import { useTranslation } from "i18next-ssg";
export interface FormError {
  title: boolean;
  desc: boolean;
}

export const CreateProposal = () => {
  const [msgs, setMsgs] = useState<MsgType[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [error, setError] = useState<FormError>({ title: false, desc: false });
  const { walletStakedTokens } = useDaoStakingInfos({
    fetchWalletStakedValue: true,
  });

  const checkAndSet = (index: number) => {
    if (Number(walletStakedTokens) <= 0) {
      return;
    }

    if (index === 1) {
      const _error: FormError = {
        title: title.length <= 0,
        desc: description.length <= 0,
      };
      setError(_error);

      if (!_error.title && !_error.desc) {
        setTabIndex(index);
      }

      // Set MsgRaw
      const _msgs = msgs.map((msg) => {
        return { ...msg, rawMsg: craftMsgRaw(msg) || {} };
      });

      setMsgs(_msgs);
    } else {
      setTabIndex(index);
    }
  };

  const craftMsgRaw = (msg: MsgType) => {
    switch (msg.type) {
      case "create-pool":
      case "execute": {
        return {
          wasm: {
            execute: {
              contract_addr: msg.contract_addr,
              msg: btoa(msg.msgBeautified),
              funds: [],
            },
          },
        };
      }
      case "custom": {
        return msg.msgBeautified;
      }
      case "migrate": {
        return {
          wasm: {
            migrate: {
              contract_addr: msg.contract_addr,
              new_code_id: Number(msg.new_code_id),
              msg: btoa(msg.msgBeautified),
            },
          },
        };
      }
    }
  };
  const { t } = useTranslation("common");
  return (
    <>
      <CreateProposalHeader />
      <Tabs index={tabIndex} onChange={(n) => checkAndSet(n)} isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab _selected={{ bgGradient: "linear(to-l, wynd.green.100, wynd.cyan.200)", color: "white" }}>
            {t("general.edit")}
          </Tab>
          <Tab _selected={{ bgGradient: "linear(to-l, wynd.green.100, wynd.cyan.200)", color: "white" }}>
            {t("general.preview")}
          </Tab>
        </TabList>
        <Grid templateColumns="1fr 3fr 1fr">
          {Number(walletStakedTokens) <= 0 && (
            <GridItem colStart={2} colSpan={1}>
              <Alert status="warning">
                <AlertIcon />
                <Text fontWeight="bold"> {t("alerts.warning")}</Text>
                <Text> {t("general.needToStakeWyndToCreateProp")}</Text>
              </Alert>
            </GridItem>
          )}
        </Grid>
        <TabPanels>
          <TabPanel>
            <EditProp
              preview={Number(walletStakedTokens) <= 0}
              msgs={msgs}
              setMsgs={setMsgs}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              setTabIndex={checkAndSet}
              error={error}
            />
          </TabPanel>
          <TabPanel>
            <Preview msgs={msgs} title={title} description={description} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
