import { Grid } from "@chakra-ui/react";
import { LsdHeader } from "./Header";
import { LsdCard } from "./LsdCard";
import { FEE_DENOM } from "../../../utils";

export interface LsdEntry {
  contractAddr: string;
  tokenDenom: string;
  id: number;
  chainName: string;
}

//! TODO find a smoother way to list LSD contracts
export const lsdEntries: LsdEntry[] = [
  {
    id: 1,
    contractAddr: "juno1ja9eyz4x7lnnvv56k30t2dfv68ln9hzkkfaj3uthvwzj2ppc470qyylhwv",
    tokenDenom: FEE_DENOM,
    chainName: "Juno",
  },
];

export const LsdOverview = () => {
  return (
    <>
      <LsdHeader />
      <Grid mt={5} templateColumns={"1fr 1fr 1fr"} gap={5}>
        <LsdCard lsdEntry={lsdEntries[0]} />
      </Grid>
    </>
  );
};
