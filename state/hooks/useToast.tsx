import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ExecuteResult } from "cosmwasm";
import { TxError } from "../../utils/txError";
import { TxToastSuccess } from "../../components/TxToast";

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
            return `Error: ${new TxError(err).pretty()}`;
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
