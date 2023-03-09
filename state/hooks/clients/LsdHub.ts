/* eslint-disable react-hooks/rules-of-hooks */

import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { useCallback } from "react";
import { useRecoilValueLoadable } from "recoil";

import { WyndLsdHubClient as ExecuteClient } from "../../clients/WyndLsdHub.client";
import { ExecuteClientParams, executeClient } from "../../recoil/selectors/clients/wynd-lsd-hub";
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

export const useBond = wrapExecuteHook("bond");
export const useClaim = wrapExecuteHook("claim");
