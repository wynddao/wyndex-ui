"use client";
/**
 * This component calculates the APY and shows it in a dropdown styled menu
 */
import {
  Button,
  Divider,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Suspense, useEffect, useState } from "react";
import { getApr, getValidatorAvgCommission } from "../../../utils/chain";

interface AprInfo {
  nominalApr: number;
  actualApr: number;
  wyndLSDnominal: number | undefined;
  wyndLSDactual: number;
  validatorAvgCommission: number;
}

export const APYCalc = ({
  validatorSet,
  lsdCommission,
}: {
  validatorSet: [string, string][];
  lsdCommission: number;
}) => {
  const [aprData, setAprData] = useState<AprInfo>({
    nominalApr: 0,
    actualApr: 0,
    wyndLSDnominal: undefined,
    wyndLSDactual: 0,
    validatorAvgCommission: 0,
  });

  // Calculate JUNO APR
  const fetchData = async () => {
    const { nominalAPR, actualAPR } = await getApr();
    const validatorAvgCommission = await getValidatorAvgCommission(validatorSet);
    const wyndNominalAPY =
      100 *
        (1 + (nominalAPR - (nominalAPR * validatorAvgCommission + nominalAPR * lsdCommission)) / 365) ** 365 -
      100;
    const wyndActualAPY = 100 * (1 + (actualAPR - actualAPR * validatorAvgCommission) / 365) ** 365 - 100;

    setAprData({
      nominalApr: nominalAPR,
      actualApr: actualAPR,
      wyndLSDactual: wyndActualAPY,
      wyndLSDnominal: wyndNominalAPY,
      validatorAvgCommission,
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex flexDir="row" justifyContent="center" alignItems="center">
      <Suspense fallback={<Spinner color="inherit" />}>
        <Popover placement="top">
          {aprData.wyndLSDnominal ? (
            <PopoverTrigger>
              <Button textDecor="underline dotted" variant="ghost" color="inherit" fontSize="3xl">
                {aprData.wyndLSDnominal.toFixed(2)}%
              </Button>
            </PopoverTrigger>
          ) : (
            <Spinner color="inherit" />
          )}
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>APY Information</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Flex justifyContent="space-between">
                  <Text fontSize="sm">JUNO APR</Text>
                  <Text fontSize="sm">{(aprData.nominalApr * 100).toFixed(2)}%</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text fontSize="sm">JUNO NET APR</Text>
                  <Text fontSize="sm">
                    {(
                      (aprData.nominalApr - aprData.nominalApr * aprData.validatorAvgCommission) *
                      100
                    ).toFixed(2)}
                    %
                  </Text>
                </Flex>
                <Divider my={1} />
                <Flex justifyContent="space-between">
                  <Flex fontSize="md" color="wynd.purple.200" alignItems="center">
                    <Text>wyJUNO APY</Text>
                    <Text fontSize="sm" ml={1}>
                      <Text fontSize="xs">(compounded daily)</Text>
                    </Text>
                  </Flex>
                  <Text fontSize="lg" color="wynd.purple.200">
                    {aprData.wyndLSDnominal && aprData.wyndLSDnominal.toFixed(2)}%
                  </Text>
                </Flex>
                <Flex fontSize="xs" justifyContent="space-between">
                  <Text>Compared to NET JUNO APR</Text>
                  <Text color={"wynd.green.400"}>
                    +
                    {aprData.wyndLSDnominal &&
                      (
                        aprData.wyndLSDnominal -
                        (aprData.nominalApr - aprData.nominalApr * aprData.validatorAvgCommission) * 100
                      ).toFixed(2)}
                    %
                  </Text>
                </Flex>
                <Divider my={2} />
                <Text fontSize="xs">
                  Juno NET APR accounts for weight average validator commissions of{" "}
                  {(aprData.validatorAvgCommission * 100).toFixed(2)}%.
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Suspense>
    </Flex>
  );
};
