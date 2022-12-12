"use client";
import { Box, Button, Stack } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import React, { useEffect, useState } from "react";
import { SwapOperation } from "../../state/clients/types/WyndexMultiHop.types";
import { useExecuteSwapOperations } from "../../state/hooks/clients/WyndexMultiHop";
import { getAssets, MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { getAssetInfo } from "../../utils/assets";
import { Asset } from "../../utils/types";
import FromToken from "./FromToken";
import Rate from "./Rate";
import Setting from "./Setting";
import ToToken from "./ToToken";

export default function Home() {
  const [data, setData] = useState<Asset[]>([]);
  const [fromItem, setFromItem] = useState<Asset>();
  const [toItem, setToItem] = useState<Asset>();
  const [loading, setLoading] = useState(true);
  const [tokenInputValue, setTokenInputValue] = useState("");
  const { address: walletAddress } = useWallet();
  const [operations, setOperations] = useState<SwapOperation[]>([]);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  const doSwap = useExecuteSwapOperations({
    contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
    sender: walletAddress ?? "",
  });

  // token : cw20 token
  // native_token : udenom

  /*const operation: SwapOperation = {
    astro_swap: {
      ask_asset_info
    }
  }
  */

  const onSwap = async () => {
    try {
      await doSwap({ maxSpread: undefined, minimumReceive: undefined, operations });
    } catch (e) {
      console.log(e);
    }
  };

  const getAsync = async () => {
    const assets = await getAssets();
    setData(assets);
  };

  useEffect(() => {
    getAsync();
  }, []);
  useEffect(() => {
    if (fromItem && toItem) {
      const operation: SwapOperation[] = [
        {
          wyndex_swap: {
            ask_asset_info: getAssetInfo(toItem),
            offer_asset_info: getAssetInfo(fromItem),
          },
        },
      ];
      setOperations(operation);
    }
  }, [fromItem, toItem]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      setData(data);
      setFromItem(data[0]);
      setToItem(data[1]);
      setTokenInputValue("0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Stack spacing={6} w="full" p={{ base: 4, sm: 6 }}>
      <Box zIndex={3000} alignSelf="end">
        <Setting />
      </Box>
      <FromToken
        data={data}
        fromItem={fromItem}
        toItem={toItem}
        tokenInputValue={tokenInputValue}
        setFromItem={setFromItem}
        setToItem={setToItem}
        setTokenInputValue={setTokenInputValue}
      />
      <ToToken data={data} toItem={toItem} setToItem={setToItem} />
      {operations.length > 0 && (
        <Rate
          amount={tokenInputValue}
          fromItem={fromItem}
          toItem={toItem}
          tokenInputValue={tokenInputValue}
          operations={operations}
        />
      )}
      <Button h={{ base: 12, md: 16 }} w="full" onClick={() => onSwap()} bg="wynd.alpha.400">
        Swap
      </Button>
    </Stack>
  );
}
