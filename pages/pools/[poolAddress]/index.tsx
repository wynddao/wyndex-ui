import { Box } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import Pool from "../../../components/Dex/Pool";
import { INDEXER_API_ENDPOINT, WYND_MAINTANANCE_MODE } from "../../../utils";

export default function Page({ poolAddress }: { poolAddress: string }) {
  return (
    <Box p="4">
      <Pool poolAddress={poolAddress} />
    </Box>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { params } = context;
  return {
    props: {
      poolAddress: params?.poolAddress,
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ poolAddress: string }> = async () => {
  const pools = !WYND_MAINTANANCE_MODE ? await (await fetch(`${INDEXER_API_ENDPOINT}/pools`)).json() : [];
  const paths = Object.keys(pools).map((poolAddress) => {
    return {
      params: {
        poolAddress,
      },
    };
  });

  return {
    paths, //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
