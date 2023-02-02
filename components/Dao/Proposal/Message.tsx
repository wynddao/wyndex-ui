import { Custom, Execute, Migrate } from "../Actions";
import { MsgType } from "../Actions/types";

export const Message = ({ type }: { type: MsgType }) => {
  switch (type.type) {
    case "execute":
      return <Execute msg={type} />;
    case "migrate":
      return <Migrate msg={type} />;
    default:
      return <Custom msg={type} />;
  }
};
