/* eslint-disable react-hooks/rules-of-hooks */

import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { useCallback } from "react";
import { useRecoilValueLoadable } from "recoil";

import { CwProposalSingleClient as ExecuteClient } from "../../clients/Cw-proposal-single";
import { ExecuteClientParams, executeClient } from "../../recoil/selectors/clients/cw-proposal-single";
import { FunctionKeyOf } from "../../types";

// This hook wrapper lets us easily make hooks out of all execution functions on
// the contract clients, without having to fetch the `executeClient` selector as
// a loadable and add `useCallback` hooks in all the components.
const wrapExecuteHook =
  <T extends FunctionKeyOf<ExecuteClient>>(fn: T) =>
  (params: ExecuteClientParams) => {
    const clientLoadable = useRecoilValueLoadable(executeClient(params));
    const client = clientLoadable.state === "hasValue" ? clientLoadable.contents : undefined;

    return useCallback(
      (...args: Parameters<ExecuteClient[T]>) => {
        if (client)
          return (client[fn] as (...args: Parameters<ExecuteClient[T]>) => Promise<ExecuteResult>)(...args);
        throw new Error("Client undefined.");
      },
      [client],
    );
  };

export const usePropose = wrapExecuteHook("propose");
export const useCastVote = wrapExecuteHook("castVote");
export const useExecute = wrapExecuteHook("execute");
export const useClose = wrapExecuteHook("close");
export const useUpdateConfig = wrapExecuteHook("updateConfig");
export const useAddProposalHook = wrapExecuteHook("addProposalHook");
export const useRemoveProposalHook = wrapExecuteHook("removeProposalHook");
export const useAddVoteHook = wrapExecuteHook("addVoteHook");
export const useRemoveVoteHook = wrapExecuteHook("removeVoteHook");
