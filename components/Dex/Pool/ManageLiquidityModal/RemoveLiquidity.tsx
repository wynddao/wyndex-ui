import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { ExecuteResult } from "cosmwasm";
import { startTransition, useState } from "react";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { Cw20Hooks, getBalanceByAsset, useIndexerInfos, useToast, useTokenInfo } from "../../../../state";
import { PairInfo, PoolResponse } from "../../../../state/clients/types/WyndexPair.types";
import { getAssetByInfo, getNativeIbcTokenDenom } from "../../../../utils/assets";
import { microamountToAmount, microdenomToDenom } from "../../../../utils/tokens";
import TokenName from "../../TokenName";

const gaps = [25, 50, 75, 100];

export default function RemoveLiquidity({
  availableTokens,
  poolData,
  pairData,
  onClose,
  refreshLpBalance,
}: {
  availableTokens: number;
  poolData: PoolResponse;
  pairData: PairInfo;
  onClose: () => void;
  refreshLpBalance: () => void;
}) {
  const [removeValue, setRemoveValue] = useState(35);
  const ltokenInfo = useTokenInfo(pairData.liquidity_token);
  const [loading, setLoading] = useState<boolean>(false);
  const { address: walletAddress } = useWallet();
  const { refreshIbcBalances, refreshCw20Balances } = useIndexerInfos({});

  const assetASelector = getBalanceByAsset({
    address: walletAddress || "",
    asset: getAssetByInfo(pairData.asset_infos[0]),
  });
  const assetBSelector = getBalanceByAsset({
    address: walletAddress || "",
    asset: getAssetByInfo(pairData.asset_infos[1]),
  });
  const refreshBalanceA = useRecoilRefresher_UNSTABLE(assetASelector);
  const refreshBalanceB = useRecoilRefresher_UNSTABLE(assetBSelector);

  const doSend = Cw20Hooks.useSend({
    sender: walletAddress ?? "",
    contractAddress: pairData.liquidity_token,
  });

  const { txToast } = useToast();

  const recieve = async () => {
    setLoading(true);
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doSend({
        amount: ((removeValue / 100) * availableTokens).toFixed(0).toString(),
        msg: btoa(
          `{"withdraw_liquidity": { "assets": ${JSON.stringify([
            {
              info: poolData.assets[0].info,
              amount: (
                (((removeValue / 100) * availableTokens) / Number(poolData.total_share)) *
                  Number(poolData.assets[0].amount) -
                2
              ).toFixed(0),
            },
            {
              info: poolData.assets[1].info,
              amount: (
                (((removeValue / 100) * availableTokens) / Number(poolData.total_share)) *
                  Number(poolData.assets[1].amount) -
                2
              ).toFixed(0),
            },
          ])} } }`,
        ),
        contract: pairData.contract_addr,
      });
      onClose();
      return result;
    });
    setLoading(false);
    // New balances will not appear until the next block.
    await new Promise((resolve) => setTimeout(resolve, 6500));
    const hasCw20 = !!pairData.asset_infos.find((info) => "token" in info);
    const hasNative = !!pairData.asset_infos.find((info) => "native" in info);
    //FIXME - This startTransition does not work
    startTransition(() => {
      refreshBalanceA();
      refreshBalanceB();
      refreshLpBalance();

      if (hasCw20) refreshCw20Balances();
      if (hasNative) refreshIbcBalances();
    });
  };
  return (
    <Box>
      <Text fontSize={{ base: "xl", sm: "xl" }} fontWeight="semibold" textAlign="center">
        <TokenName address={pairData.liquidity_token} />
      </Text>
      <Text fontSize={{ base: "5xl", sm: "7xl" }} fontWeight="bold" textAlign="center">
        {microamountToAmount((removeValue / 100) * availableTokens, ltokenInfo.tokenDecimals, 6)}
      </Text>
      <Flex justify={"space-between"} pb={10}>
        {poolData.assets.map((asset, i) => (
          <Box key={i}>
            <Text>
              ≈
              {microamountToAmount(
                (((removeValue / 100) * availableTokens) / Number(poolData.total_share)) *
                  Number(asset.amount),
                ltokenInfo.tokenDecimals,
                6,
              )}{" "}
              {asset.info.hasOwnProperty("token") ? (
                //@ts-ignore
                <TokenName symbol={true} address={asset.info.token} />
              ) : (
                //@ts-ignore
                <span>{microdenomToDenom(getNativeIbcTokenDenom(asset.info.native))}</span>
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
          isLoading={loading}
          loadingText={"Executing"}
        >
          Remove Liquidity
        </Button>
      </Box>
    </Box>
  );
}
