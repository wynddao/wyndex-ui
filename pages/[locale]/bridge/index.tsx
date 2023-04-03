import { SquidWidget } from "@0xsquid/widget";
import { Box, Flex } from "@chakra-ui/react";
import Head from "next/head";
import SquidWidgetStylesOverride from "../../../components/Dex/SquidWidgetStylesOverride";
import { squidWidgetConfig } from "../../../utils/squidWidget";
import { makeStaticProps, getStaticPaths } from "i18next-ssg/server";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND | DAO - Bridge Tokens</title>
      </Head>
      <Flex
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        bgImage={"/images/Vector.png"}
        bgRepeat={"no-repeat"}
        bgSize={"cover"}
        bgPos="left"
        minH="100vh"
      >
        <SquidWidgetStylesOverride>
          <SquidWidget config={squidWidgetConfig} />
        </SquidWidgetStylesOverride>
      </Flex>
      <Box
        bgImage={"/flute.png"}
        bgRepeat={"no-repeat"}
        bgSize={"cover"}
        bgPos={"center"}
        position="absolute"
        h={{ xl: "400px", "2xl": "520px" }}
        w={{ xl: "260px", "2xl": "400px" }}
        bottom="0.5rem"
        right="0.5rem"
      />
    </>
  );
}

const getStaticProps = makeStaticProps(["common"]);
export { getStaticPaths, getStaticProps };
