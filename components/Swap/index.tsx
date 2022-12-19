"use client";
import { Box, Button, Flex, Image, keyframes } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SwapOperation } from "../../state/clients/types/WyndexMultiHop.types";
import { useExecuteSwapOperations } from "../../state/hooks/clients/WyndexMultiHop";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { getAssetInfo } from "../../utils/assets";
import SwapIcon from "./FromToComponent/SwapIcon";
import FromToken from "./FromToComponent/FromToken";
import Rate from "./RateComponent/Rate";
import Setting from "./Setting/Setting";
import ToToken from "./FromToComponent/ToToken";
import { Asset } from "@wynddao/asset-list";
import { getAssetList } from "../../utils/getAssetList";
import { useSimulateOperationInfos } from "../../state/hooks/useSimulateOperationInfos";
import { amountToMicroamount, microamountToAmount } from "../../utils/tokens";
import { toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { getBalanceByAsset } from "../../state";
import { TxError } from "../../utils/txError";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Swap: React.FC = () => {
  const assetList = getAssetList();
  const [fromToken, setFromToken] = useState<Asset>(assetList.tokens[3]);
  const [toToken, setToToken] = useState<Asset>(assetList.tokens[1]);
  const { address: walletAddress, connect, isWalletConnected } = useWallet();
  const [operations, setOperations] = useState<SwapOperation[]>([]);
  const [inputAmount, setInputAmount] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<number>(1);
  const balance = useRecoilValue(getBalanceByAsset({ address: walletAddress as string, asset: fromToken }));

  const { simulatedOperation } = useSimulateOperationInfos(
    amountToMicroamount(inputAmount, fromToken.decimals),
    operations,
  );

  const doSwap = useExecuteSwapOperations({
    contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
    sender: walletAddress ?? "",
  });

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  useEffect(() => {
    if (fromToken && toToken) {
      const operation: SwapOperation[] = [
        {
          wyndex_swap: {
            ask_asset_info: getAssetInfo(toToken as Asset),
            offer_asset_info: getAssetInfo(fromToken as Asset),
          },
        },
      ];
      setOperations(operation);
    }
  }, [fromToken, toToken]);

  const onClick = useCallback(async () => {
    if (loading) return;
    if (walletAddress) {
      setLoading(true);
      try {
        await doSwap({ operations }, "auto", undefined, [
          { amount: amountToMicroamount(inputAmount, fromToken.decimals).toString(), denom: "ujunox" },
        ]);
      } catch (err) {
        toast.error(`Error: ${new TxError(err as string).pretty()}`, {
          id: "tx.error",
          style: {
            background: "var(--chakra-colors-chakra-body-bg)",
            color: "var(--chakra-colors-chakra-body-text)",
          },
        });
      }
      setLoading(false);
    } else {
      connect();
    }
  }, [connect, doSwap, fromToken, inputAmount, loading, operations, walletAddress]);

  const buttonText = useMemo(() => {
    if (loading) return "";
    if (!walletAddress) return "Connect Wallet";
    if (inputAmount > microamountToAmount(balance.amount, fromToken.decimals)) return "Insufficient Amount";
    if (walletAddress) return "Swap";
  }, [balance, fromToken, inputAmount, loading, walletAddress]);

  return (
    <Flex
      gap={{ base: "2rem", lg: "4rem" }}
      flexFlow="column"
      w="full"
      p={{ base: 4, sm: 6 }}
      maxWidth="1200px"
    >
      <Box zIndex={100} alignSelf="end">
        <Setting slippage={slippage} setSlippage={setSlippage} />
      </Box>
      <Box display="flex" flexFlow={{ base: "column", lg: "row" }} gap="1rem" position="relative">
        <FromToken
          fromToken={fromToken}
          setFromToken={setFromToken}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          balance={balance}
        />
        <SwapIcon swapTokens={swapTokens} />
        <ToToken toToken={toToken} setToToken={setToToken} expectedAmount={simulatedOperation} />
      </Box>
      <Button
        h={{ base: 12, lg: 16 }}
        w="full"
        bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
        onClick={onClick}
        disabled={
          !loading &&
          isWalletConnected &&
          inputAmount > microamountToAmount(balance.amount, fromToken.decimals)
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
        {loading && (
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
          expectedAmount={simulatedOperation}
          inputAmount={inputAmount}
        />
      )}
    </Flex>
  );
};

export default Swap;
