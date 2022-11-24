"use client";
import { Center, Grid, GridItem } from "@chakra-ui/react";
import Image from "next/image";
import Swap from "../../components/Swap";
import flute from "./assets/flute.png";

export default function Page() {
  return (
    <Grid h={{ xl: "100vh" }} overflow="hidden" templateColumns="repeat(8, 1fr)" position="relative">
      <GridItem colStart={{ base: 0, xl: 2 }} colSpan={{ base: 8, xl: 4 }}>
        <Swap />
      </GridItem>
      <GridItem display={{ base: "none", xl: "flex" }} colSpan={3}>
        <Center>
          <Image
            style={{
              maxWidth: "50%",
              transform: "scaleX(-1)",
              position: "absolute",
              bottom: -300,
              right: -200,
              overflow: "hidden",
            }}
            alt="Panflute Druid"
            src={flute}
            placeholder="blur"
          />
        </Center>
      </GridItem>
    </Grid>
  );
}
