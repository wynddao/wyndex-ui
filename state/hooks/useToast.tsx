import React from "react";
import { toast } from "react-hot-toast";
import { ExecuteResult } from "cosmwasm";
import { TxError } from "../../utils/txError";
import { TxToastSuccess } from "../../components/TxToast";

export const useToast = () => {
  const txToast = async (fn: Function, ...args: unknown[]): Promise<ExecuteResult | undefined> => {
    try {
      return await toast.promise(
        fn(...args),
        {
          loading: "Loading...",
          success: (tx: ExecuteResult) => {
            toast.dismiss("tx.loading");
            return <TxToastSuccess tx={tx} />;
          },
          error: (err) => `Error: ${new TxError(err).pretty()}`,
        },
        {
          error: {
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
      toast.error(`${err}`, {
        style: {
          background: "var(--chakra-colors-chakra-body-bg)",
          color: "var(--chakra-colors-chakra-body-text)",
        },
      });
    }
  };

  return {
    txToast,
  };
};
