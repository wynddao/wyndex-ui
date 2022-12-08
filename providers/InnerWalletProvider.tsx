import { useWallet } from "@cosmos-kit/react";
import { SigningCosmWasmClient } from "cosmwasm";
import { PropsWithChildren, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { signingCosmWasmClientAtom } from "../state";

const InnerWalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const setSigningCosmWasmClient = useSetRecoilState(signingCosmWasmClientAtom);
  const { getSigningCosmWasmClient } = useWallet();

  // Save client in recoil atom so it can be used by selectors.
  useEffect(() => {
    const loadClient = async () => {
      const client = await getSigningCosmWasmClient();
      setSigningCosmWasmClient(client as unknown as SigningCosmWasmClient);
    };
    loadClient();
  }, [setSigningCosmWasmClient, getSigningCosmWasmClient]);

  return <>{children}</>;
};

export default InnerWalletProvider;
