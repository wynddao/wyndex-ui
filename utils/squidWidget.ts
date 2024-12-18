import { AppConfig } from "@0xsquid/widget/widget/core/types/config";

export const squidWidgetConfig: AppConfig = {
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
    advanced: {
      transparentWidget: true,
    },
  },
  slippage: 1.5,
  infiniteApproval: false,
  instantExec: false,
  apiUrl: "https://api.squidrouter.com",
  titles: {
    swap: "",
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
};
