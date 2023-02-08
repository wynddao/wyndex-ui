import { ExecuteResult } from "cosmwasm";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TxToastSuccess } from "../../components/General/TxToast";
import TxToastError from "../../components/General/TxToast/TxToastError";
import { txError } from "../../utils/txError";

export const useToast = () => {
  const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
  const txToast = async (fn: Function, ...args: unknown[]): Promise<ExecuteResult | undefined> => {
    try {
      return await toast.promise(
        (() => {
          setIsTxLoading(true);
          return fn(...args);
        })(),
        {
          loading: "Loading...",
          success: (tx: ExecuteResult) => {
            setIsTxLoading(false);
            toast.dismiss("tx.loading");
            return <TxToastSuccess tx={tx} />;
          },
          error: (err) => {
            setIsTxLoading(false);
            toast.dismiss("tx.loading");
            return <TxToastError txError={txError.init(err)} />;
          },
        },
        {
          error: {
            id: "tx.error",
            style: {
              background: "var(--chakra-colors-chakra-body-bg)",
              color: "var(--chakra-colors-chakra-body-text)",
            },
          },
          success: {
            duration: Infinity,
            id: "tx.success",
            style: {
              background: "var(--chakra-colors-chakra-body-bg)",
              color: "var(--chakra-colors-chakra-body-text)",
            },
          },
          loading: {
            id: "tx.loading",
            style: {
              background: "var(--chakra-colors-chakra-body-bg)",
              color: "var(--chakra-colors-chakra-body-text)",
            },
          },
        },
      );
    } catch (err) {
      setIsTxLoading(false);
      toast.error(`${err}`, {
        id: "tx.error",
        style: {
          background: "var(--chakra-colors-chakra-body-bg)",
          color: "var(--chakra-colors-chakra-body-text)",
        },
      });
    }
  };

  return {
    isTxLoading,
    txToast,
  };
};
