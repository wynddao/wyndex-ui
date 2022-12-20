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
import { Cw20Hooks, useCw20UserInfos, useToast, WyndexPairHooks } from "../../../state";
import { PairInfo, PoolResponse } from "../../../state/clients/types/WyndexPair.types";
import { microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import TokenName from "../../TokenName";

const gaps = [25, 50, 75, 100];

export default function RemoveLiquidity({
  availableTokens,
  poolData,
  pairData,
  onClose,
  refreshBalance,
}: {
  availableTokens: number;
  poolData: PoolResponse;
  pairData: PairInfo;
  onClose: () => void;
  refreshBalance: () => void;
}) {
  const [removeValue, setRemoveValue] = useState(35);
  const { address: walletAddress } = useWallet();

  const doSend = Cw20Hooks.useSend({
    sender: walletAddress ?? "",
    contractAddress: pairData.liquidity_token,
  });

  const { txToast } = useToast();

  const recieve = async () => {
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doSend({
        amount: ((removeValue / 100) * availableTokens).toFixed(0).toString(),
        msg: btoa(`{"withdraw_liquidity": { "assets": ${JSON.stringify(poolData.assets)}}}`),
        contract: pairData.contract_addr,
      });

      onClose();
      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshBalance();

      return result;
    });
  };
  return (
    <Box>
      <Text fontSize={{ base: "xl", sm: "xl" }} fontWeight="semibold" textAlign="center">
        {/* TODO */}
        UJUN-TTOK-LP
      </Text>
      <Text fontSize={{ base: "5xl", sm: "7xl" }} fontWeight="bold" textAlign="center">
        {Number(microamountToAmount((removeValue / 100) * availableTokens, 6)).toFixed(6)}
      </Text>
      <Flex justify={"space-between"} pb={10}>
        {poolData.assets.map((asset, i) => (
          <Box key={i}>
            <Text>
              ≈
              {Number(
                microamountToAmount(
                  (((removeValue / 100) * availableTokens) / Number(poolData.total_share)) *
                    Number(asset.amount),
                  6,
                ),
              ).toFixed(6)}{" "}
              {asset.info.hasOwnProperty("token") ? (
                //@ts-ignore
                <TokenName symbol={true} address={asset.info.token} />
              ) : (
                //@ts-ignore
                <span>{microdenomToDenom(asset.info.native)}</span>
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
