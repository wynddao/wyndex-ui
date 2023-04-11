import Head from "next/head";
import Pools from "../../components/Dex/Pools";
import { ClientComponent } from "../../components/General/ClientComponent";

export const metadata = {
  title: "WYND | DEX - Pool Overview",
};

export default function Page() {
  return (
    <>
      <ClientComponent>
        <Pools />
      </ClientComponent>
    </>
  );
}
