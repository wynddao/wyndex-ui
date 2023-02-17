import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { toBase64 } from "cosmwasm";
import { useState } from "react";
import { MsgType } from "../Actions/types";
import { EditProp } from "./EditProp";
import { CreateProposalHeader } from "./Header";
import { Preview } from "./Preview";

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

  const checkAndSet = (index: number) => {
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
              new_code_id: msg.new_code_id,
              msg: btoa(msg.msgBeautified),
            },
          },
        };
      }
    }
  };

  return (
    <>
      <CreateProposalHeader />
      <Tabs index={tabIndex} onChange={(n) => checkAndSet(n)} isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab _selected={{ bgGradient: "linear(to-l, wynd.green.100, wynd.cyan.200)", color: "white" }}>
            Edit
          </Tab>
          <Tab _selected={{ bgGradient: "linear(to-l, wynd.green.100, wynd.cyan.200)", color: "white" }}>
            Preview
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EditProp
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
