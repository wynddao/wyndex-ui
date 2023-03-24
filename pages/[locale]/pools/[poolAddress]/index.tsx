import Pool from "../../../../components/Dex/Pool";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import { INDEXER_API_ENDPOINT, WYND_MAINTANANCE_MODE } from "../../../../utils";
import { i18n } from "../../../../next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Page({ poolAddress }: { poolAddress: string }) {
  return <Pool poolAddress={poolAddress} />;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { params } = context;
  return {
    props: { ...(await getI18nProps(context)), poolAddress: params?.poolAddress },
  };
}

type Context = Record<string, any>;

async function getI18nProps(ctx: Context, ns: string[] = ["common"]) {
  const locale = ctx?.params?.locale;
  return serverSideTranslations(locale, ns);
}

export const getStaticPaths: GetStaticPaths<{ poolAddress: string; locale: string }> = async () => {
  const pools = !WYND_MAINTANANCE_MODE ? await (await fetch(`${INDEXER_API_ENDPOINT}/pools`)).json() : [];
  const paths = Object.keys(pools).map((poolAddress) => {
    return {
      params: {
        poolAddress,
      },
    };
  });

  const localizedPaths: { params: { poolAddress: string; locale: string } }[] = [];

  i18n.locales.map((lang) => {
    paths.map((path) => {
      localizedPaths.push({ params: { ...path.params, locale: lang } });
    });
  });

  return {
    paths: localizedPaths, //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
