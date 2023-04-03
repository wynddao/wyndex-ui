import Head from "next/head";
import Pools from "../../../components/Dex/Pools";
import { makeStaticProps, getStaticPaths } from "i18next-ssg/server";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND | DEX - Pool Overview</title>
      </Head>
      <Pools />
    </>
  );
}

const getStaticProps = makeStaticProps(["common"]);
export { getStaticPaths, getStaticProps };
