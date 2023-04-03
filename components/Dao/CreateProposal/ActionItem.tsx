import { Box, Button, Flex } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useState } from "react";
import { Custom, Execute, Migrate } from "../Actions";
import { CreatePool } from "../Actions/CreatePool";
import { MsgType } from "../Actions/types";
import { useTranslation } from "i18next-ssg";

export const ActionItem = ({
  id,
  msg,
  deleteMsg,
  changeMsg,
}: {
  id: number;
  msg: MsgType;
  deleteMsg: (id: number) => void;
  changeMsg: (id: number, newMsg: MsgType) => void;
}) => {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const { t } = useTranslation("common");

  const options = [
    { value: "create-pool", label: "Create Pool" },
    { value: "execute", label: "Execute Contract" },
    { value: "migrate", label: "Migrate Contract" },
  ];

  const setMsg = (newMsg: MsgType) => {
    changeMsg(id, newMsg);
  };
  const setMsgType = (type: string) => {
    setMsg({ ...msg, type });
  };

  const ShowSelected = () => {
    if (selected === "create-pool") return <CreatePool setMsg={setMsg} msg={msg} edit={true} />;
    if (selected === "execute") return <Execute setMsg={setMsg} msg={msg} edit={true} />;
    if (selected === "migrate") return <Migrate setMsg={setMsg} msg={msg} edit={true} />;
    if (selected === "custom") return <Custom msg={msg} edit={true} />;
    return <></>;
  };
  return (
    <>
      <Select
        options={options}
        onChange={(e) => {
          setSelected(e?.value);
          setMsgType(e?.value || "custom");
        }}
      />
      <Box p={3}>
        <ShowSelected />
        <Flex justifyContent="end">
          <Button
            backgroundColor="wynd.alert.error.200"
            _hover={{ backgroundColor: "wynd.alert.error.300" }}
            onClick={() => deleteMsg(id)}
          >
            {t("actions.deleteMessage")}
          </Button>
        </Flex>
      </Box>
    </>
  );
};
