import { Box, Button, Flex, Image, keyframes } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Asset, CW20Asset } from "@wynddao/asset-list";
import { toBase64, toUtf8 } from "cosmwasm";
import React, { startTransition, useCallback, useMemo, useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { getBalanceByAsset, useIndexerInfos, useToast } from "../../state";
import { useSend } from "../../state/hooks/clients/Cw20";
import { useExecuteSwapOperations } from "../../state/hooks/clients/WyndexMultiHop";
import { useSimulateOperationInfos } from "../../state/hooks/useSimulateOperationInfos";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { getAssetInfo } from "../../utils/assets";
import { getAssetList } from "../../utils/getAssetList";
import { getRouteByOperations } from "../../utils/getRouteByOperations";
import { amountToMicroamount, microamountToAmount } from "../../utils/tokens";
import FromToken from "./FromToComponent/FromToken";
import SwapIcon from "./FromToComponent/SwapIcon";
import ToToken from "./FromToComponent/ToToken";
import Rate from "./RateComponent/Rate";
import Setting from "./Setting/Setting";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Swap: React.FC = () => {
  const assetList = getAssetList();
  const [fromToken, setFromToken] = useState<Asset>(assetList.tokens[3]);
  const [toToken, setToToken] = useState<Asset>(assetList.tokens[1]);
  const { address: walletAddress, connect, isWalletConnected } = useWallet();
  const [inputAmount, setInputAmount] = useState<string>("1");
  const [slippage, setSlippage] = useState<number>(1);
  const { txToast, isTxLoading } = useToast();
  const { swapOperationRoutes, refreshIbcBalances, refreshCw20Balances } = useIndexerInfos({});
  const fromBalanceSelector = getBalanceByAsset({ address: walletAddress || "", asset: fromToken });
  const fromBalance = useRecoilValue(fromBalanceSelector);
  const refreshFromBalance = useRecoilRefresher_UNSTABLE(fromBalanceSelector);
  const refreshToBalance = useRecoilRefresher_UNSTABLE(
    getBalanceByAsset({ address: walletAddress || "", asset: toToken }),
  );

  const operations = useRecoilValue(
    swapOperationRoutes({ askAsset: getAssetInfo(toToken), offerAsset: getAssetInfo(fromToken) }),
  );

  const { simulatedOperation } = useSimulateOperationInfos(
    amountToMicroamount(inputAmount, fromToken.decimals),
    operations,
  );

  const swapNative = useExecuteSwapOperations({
    contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
    sender: walletAddress || "",
  });

  const sendCW20 = useSend({
    contractAddress: (fromToken as CW20Asset).token_address || "",
    sender: walletAddress || "",
  });

  const swap = useCallback(async () => {
    const spread = (slippage / 100).toString();

    if (fromToken.tags.includes("cw20")) {
      return await sendCW20({
        amount: amountToMicroamount(inputAmount, fromToken.decimals).toString(),
        contract: MULTI_HOP_CONTRACT_ADDRESS,
        msg: toBase64(
          toUtf8(JSON.stringify({ execute_swap_operations: { operations, max_spread: spread } })),
        ),
      });
    }

    return swapNative({ operations, maxSpread: spread }, "auto", undefined, [
      { amount: amountToMicroamount(inputAmount, fromToken.decimals).toString(), denom: fromToken.denom },
    ]);
  }, [
    fromToken.decimals,
    fromToken.denom,
    fromToken.tags,
    inputAmount,
    operations,
    sendCW20,
    slippage,
    swapNative,
  ]);

  const swapTokenPosition = () => {
    startTransition(() => {
      setFromToken(toToken);
      setToToken(fromToken);
      setInputAmount(microamountToAmount(simulatedOperation.amount, fromToken.decimals, 6));
    });
  };

  const handlerSwap = useCallback(async () => {
    if (isTxLoading) return;
    if (walletAddress) {
      await txToast(swap);

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 500));
      //FIXME - This startTransition does not work
      startTransition(() => {
        refreshFromBalance();
        refreshToBalance();
        if ("token_address" in fromToken || "token_address" in toToken) {
          refreshCw20Balances();
        }
        if (!("token_address" in fromToken) && !("token_address" in toToken)) {
          refreshIbcBalances();
        }
      });
    } else {
      connect();
    }
  }, [
    connect,
    fromToken,
    isTxLoading,
    refreshCw20Balances,
    refreshFromBalance,
    refreshIbcBalances,
    refreshToBalance,
    swap,
    toToken,
    txToast,
    walletAddress,
  ]);

  const buttonText = useMemo(() => {
    if (isTxLoading) return "";
    if (!walletAddress) return "Connect Wallet";
    if (Number(inputAmount) > Number(microamountToAmount(fromBalance.amount, fromToken.decimals)))
      return "Insufficient Amount";
    if (walletAddress) return "Swap";
  }, [fromBalance.amount, fromToken.decimals, inputAmount, isTxLoading, walletAddress]);

  return (
    <Flex
      gap={{ base: "2rem", lg: "4rem" }}
      flexFlow="column"
      w="full"
      p={{ base: 4, sm: 6 }}
      maxWidth="780px"
    >
      <Box zIndex={100} alignSelf="end">
        <Setting slippage={slippage} setSlippage={setSlippage} />
      </Box>
      <Box display="flex" flexFlow={{ base: "column" }} gap={{ base: 1, lg: 0 }} position="relative">
        <FromToken
          toToken={toToken}
          fromToken={fromToken}
          setFromToken={setFromToken}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          balance={fromBalance}
        />
        <SwapIcon swapTokens={swapTokenPosition} />
        <ToToken
          fromToken={fromToken}
          toToken={toToken}
          setToToken={setToToken}
          inputAmount={inputAmount}
          expectedAmount={simulatedOperation.amount}
        />
      </Box>
      <Button
        h={{ base: 12, lg: 16 }}
        w="full"
        bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
        onClick={handlerSwap}
        disabled={
          !isTxLoading &&
          isWalletConnected &&
          Number(inputAmount) > Number(microamountToAmount(fromBalance.amount, fromToken.decimals))
        }
        bg="wynd.gray.200"
        maxW={{ lg: "560px" }}
        margin={{ lg: "0 auto" }}
        _hover={{
          bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
          ":disabled": {
            bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
            cursor: "initial",
          },
        }}
        _disabled={{
          bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
          cursor: "initial",
        }}
      >
        {isTxLoading && (
          <Image
            alt="Wynd logo"
            src="/logo-white-no-text.svg"
            width="38px"
            height="38px"
            animation={`${spin} infinite linear 2s`}
          />
        )}
        {buttonText}
      </Button>
      {operations.length > 0 && (
        <Rate
          slippage={slippage}
          fromToken={fromToken}
          logo-black-no-text
          toToken={toToken}
          simulatedOperation={simulatedOperation}
          inputAmount={inputAmount}
          route={getRouteByOperations(operations)}
        />
      )}
    </Flex>
  );
};

export default Swap;
