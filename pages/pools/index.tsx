import Head from "next/head";
import Pools from "../../components/Pools";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND DEX | Pool Overview</title>
      </Head>
      <Pools />
    </>
  );
}
