import Pool from "../../../components/Pool";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPropsContext } from "next";

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
