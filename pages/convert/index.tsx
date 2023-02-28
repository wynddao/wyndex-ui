import { SquidWidget } from "@0xsquid/widget";
import { Box } from "@chakra-ui/react";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND | DAO - Convert Tokens</title>
      </Head>
      <Box p="4" width="fit-content" marginBlock={{ sm: 4, md: 8, lg: 16 }} marginInline="auto">
        <SquidWidget
          config={{
            companyName: "WYND",
            mainLogoUrl: "",
            style: {
              neutralContent: "#959BB2",
              baseContent: "#E8ECF2",
              base100: "#10151B",
              base200: "#272D3D",
              base300: "#171D2B",
              error: "#ED6A5E",
              warning: "#F4D06C",
              success: "#75B54A",
              primary: "#47BEC2",
              secondary: "#47BEC2",
              secondaryContent: "#191C29",
              neutral: "#191C29",
              roundedBtn: "5px",
              roundedBox: "5px",
              roundedDropDown: "7px",
              displayDivider: true,
            },
            slippage: 1.5,
            infiniteApproval: false,
            instantExec: false,
            apiUrl: "https://api.squidrouter.com",
            comingSoonChainIds: [
              42161,
              "cosmoshub-4",
              "injective-1",
              "axelar-dojo-1",
              "fetchhub-4",
              "kichain-2",
            ],
            titles: {
              swap: "Convert",
              settings: "Settings",
              wallets: "Wallets",
              tokens: "Tokens",
              chains: "Chains",
              history: "History",
              transaction: "Transaction",
              destination: "Destination address",
            },
            priceImpactWarnings: {
              warning: 3,
              critical: 5,
            },
            initialFromChainId: 1, // Ethereum
            initialToChainId: "juno-1" as unknown as number, // Juno
          }}
        />
      </Box>
    </>
  );
}
