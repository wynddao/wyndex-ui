import Pool from "../../../components/Dex/Pool";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import { INDEXER_API_ENDPOINT } from "../../../utils";

export default function Page({ poolAddress }: { poolAddress: string }) {
  return <Pool poolAddress={poolAddress} />;
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
  const pools = await (await fetch(`${INDEXER_API_ENDPOINT}/pools`)).json();
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
