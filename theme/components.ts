import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { ProgressTheme } from "../components/Dao/Vote/Progress";

export const components = {
  Steps,
  ...ProgressTheme,
  Modal: {
    baseStyle: {
      dialog: {
        bgColor: "wynd.base.subBg",
      },
    },
  },
};
