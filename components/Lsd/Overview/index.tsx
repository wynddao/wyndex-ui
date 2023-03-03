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
    contractAddr: "juno1ek4ed6yevgx4x0mnce4h58y4p30ay7k35g2vrt0nmnlt6ttsmpmq270tee",
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
