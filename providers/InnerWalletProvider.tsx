import { useChain, useWallet } from "@cosmos-kit/react";
import { PropsWithChildren, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { signingCosmWasmStargateClientAtom } from "../state";

const InnerWalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const setSigningCosmWasmClient = useSetRecoilState(signingCosmWasmStargateClientAtom);
  const { getSigningCosmWasmClient, address } = useChain("juno");

  // Save client in recoil atom so it can be used by selectors.
  useEffect(() => {
    const loadClient = async () => {
      if (address) {
        const client = await getSigningCosmWasmClient();
        setSigningCosmWasmClient(client);
      }
    };
    loadClient();
  }, [setSigningCosmWasmClient, getSigningCosmWasmClient, address]);

  return <>{children}</>;
};

export default InnerWalletProvider;
