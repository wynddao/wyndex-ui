"use client";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import React, { useEffect, useState } from "react";
import { SwapOperation } from "../../state/clients/types/WyndexMultiHop.types";
import { useExecuteSwapOperations } from "../../state/hooks/clients/WyndexMultiHop";
import { getAssets, MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { getAssetInfo } from "../../utils/assets";
import SwapIcon from "./FromToComponent/SwapIcon";
import FromToken from "./FromToComponent/FromToken";
import Rate from "./RateComponent/Rate";
import Setting from "./Setting/Setting";
import ToToken from "./FromToComponent/ToToken";
import { Asset, CW20Asset, IBCAsset, assetList } from "@wynddao/asset-list";

export default function Home() {
  const [data, setData] = useState<Asset[]>([]);
  const [fromToken, setFromToken] = useState<Asset | IBCAsset | CW20Asset>(assetList.tokens[0]);
  const [toToken, setToToken] = useState<Asset | IBCAsset | CW20Asset>(assetList.tokens[4]);
  const [loading, setLoading] = useState(false);
  const { address: walletAddress } = useWallet();
  const [operations, setOperations] = useState<SwapOperation[]>([]);

  const doSwap = useExecuteSwapOperations({
    contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
    sender: walletAddress ?? "",
  });

  const onSwap = async () => {
    try {
      await doSwap({ maxSpread: undefined, minimumReceive: undefined, operations });
    } catch (e) {
      console.log(e);
    }
  };

  /*   const getAsync = async () => {
    const assets = await getAssets();
    setData(assets);
  }; */

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  /*   useEffect(() => {
    getAsync();
  }, []); */

  useEffect(() => {
    if (fromToken && toToken) {
      const operation: SwapOperation[] = [
        {
          wyndex_swap: {
            ask_asset_info: getAssetInfo(toToken as any),
            offer_asset_info: getAssetInfo(fromToken as any),
          },
        },
      ];
      setOperations(operation);
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    if (data.length > 0) {
      setData(data);
      setFromToken(data[0]);
      setToToken(data[1]);
      /* setTokenInputValue("0"); */
    }
  }, [data]);

  return (
    <Flex
      gap={{ base: "2rem", lg: "4rem" }}
      flexFlow="column"
      w="full"
      p={{ base: 4, sm: 6 }}
      maxWidth="1200px"
    >
      <Box zIndex={100} alignSelf="end">
        <Setting />
      </Box>
      <Box display="flex" flexFlow={{ base: "column", lg: "row" }} gap="1rem" position="relative">
        <FromToken fromToken={fromToken} setFromToken={setFromToken} />
        <SwapIcon swapTokens={swapTokens} />
        <ToToken toToken={toToken} setToToken={setToToken} />
      </Box>
      <Button
        h={{ base: 12, md: 16 }}
        w="full"
        bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
        onClick={() => onSwap()}
        bg="wynd.gray.200"
        maxW={{ lg: "560px" }}
        minW={{ lg: "560px" }}
        margin={{ lg: "0 auto" }}
        _hover={{
          bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
        }}
      >
        Swap
      </Button>
      {operations.length > 0 && (
        <Rate fromToken={fromToken} toToken={toToken} tokenInputValue="0" operations={operations} />
      )}
    </Flex>
  );
}
