"use client";

import {
  Box,
  Button,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { ExecuteResult } from "cosmwasm";
import { useState } from "react";
import { useToast, WyndexPairHooks } from "../../../state";
import { PairInfo, PoolResponse } from "../../../state/clients/types/WyndexPair.types";
import TokenName from "../../TokenName";

const gaps = [25, 50, 75, 100];

export default function RemoveLiquidity({
  availableTokens,
  poolData,
  pairData,
}: {
  availableTokens: number;
  poolData: PoolResponse;
  pairData: PairInfo;
}) {
  const [removeValue, setRemoveValue] = useState(35);
  const { address: walletAddress } = useWallet();
  const doRecieve = WyndexPairHooks.useRecieve({
    contractAddress: pairData.contract_addr,
    sender: walletAddress ?? "",
  });

  const { txToast } = useToast();

  const recieve = async () => {
    console.log(pairData);
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doRecieve({
        amount: ((removeValue / 100) * availableTokens).toFixed(0).toString(),
        msg: btoa(`{"withdraw_liquidity": { "assets": ${JSON.stringify(poolData.assets)}}}`),
        sender: walletAddress || "",
      });
      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      // TODO refreshBalance();
      return result;
    });
  };
  return (
    <Box>
      <Text fontSize={{ base: "xl", sm: "xl" }} fontWeight="semibold" textAlign="center">
        UJUN-TTOK-LP
      </Text>
      <Text fontSize={{ base: "5xl", sm: "7xl" }} fontWeight="bold" textAlign="center">
        {((removeValue / 100) * availableTokens).toFixed(0)}
      </Text>
      <Flex justify={"space-between"} pb={10}>
        {poolData.assets.map((asset, i) => (
          <Box key={i}>
            <Text>
              ≈
              {(
                (((removeValue / 100) * availableTokens) / Number(poolData.total_share)) *
                Number(asset.amount)
              ).toFixed(2)}{" "}
              {asset.info.hasOwnProperty("token") ? (
                //@ts-ignore
                <TokenName address={asset.info.token} />
              ) : (
                //@ts-ignore
                <span>{asset.info.native_token}</span>
              )}
            </Text>
          </Box>
        ))}
      </Flex>
      <Slider
        min={0}
        max={100}
        step={0.1}
        size="lg"
        colorScheme="primary"
        defaultValue={removeValue}
        value={removeValue}
        onChange={(val) => setRemoveValue(val)}
        mb={16}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb w={{ base: 5, sm: 7 }} h={{ base: 5, sm: 7 }} />
      </Slider>
      <SimpleGrid columns={{ sm: 4 }} spacing={4} mb={20}>
        {gaps.map((v, i) => (
          <Button key={i} variant="outline" onClick={() => setRemoveValue(v)}>
            {v}%
          </Button>
        ))}
      </SimpleGrid>
      <Box px={{ sm: 12 }}>
        <Button
          onClick={() => recieve()}
          isDisabled={removeValue > 0 ? false : true}
          w="full"
          size="lg"
          h={{ base: 12, sm: 14 }}
        >
          Remove Liquidity
        </Button>
      </Box>
    </Box>
  );
}
