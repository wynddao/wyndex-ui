import { Asset, CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { INDEXER_API_ENDPOINT } from "../../../../utils";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
export const LineChart = ({
  fromToken,
  toToken,
  open,
}: {
  fromToken: Asset;
  toToken: Asset;
  open: boolean;
}) => {
  const [totalHistory, setTotalHistory] = useState<ApexAxisChartSeries>([]);

  const getDenom = (token: Asset) => {
    if (token.tags.includes("cw20")) {
      return (token as CW20Asset).token_address;
    } else if (token.tags.includes("ibc")) {
      return (token as IBCAsset).juno_denom;
    } else {
      return token.denom;
    }
  };

  const fetchData = async () => {
    if (open) {
      setTotalHistory([]);
      const _fromTokenHistory = await (
        await fetch(
          `${INDEXER_API_ENDPOINT}/assets/prices/historical/${encodeURIComponent(getDenom(fromToken))}`,
        )
      ).json();

      const _toTokenHistory = await (
        await fetch(
          `${INDEXER_API_ENDPOINT}/assets/prices/historical/${encodeURIComponent(getDenom(toToken))}`,
        )
      ).json();

      const _totalHistory = _fromTokenHistory.map((el: any) => {
        return [
          el.timestamp,
          Number(el.priceInUsd) /
            Number(_toTokenHistory.find((his: any) => el.timestamp === his.timestamp).priceInUsd),
        ];
      });

      setTotalHistory([
        {
          name: `${fromToken.name} -> ${toToken.name}`,
          data: _totalHistory,
        },
      ]);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, open]);

  const options: ApexOptions = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        autoSelected: "zoom",
      },
    },
    noData: {
      text: "Loading...",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#fff",
        fontSize: "14px",
        fontFamily: "Barlow",
      },
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: "#000",
          label: {
            text: "Support",
            style: {
              color: "#fff",
              background: "#00E396",
            },
          },
        },
      ],
      xaxis: [
        {
          x: new Date("25 Jan 202 16:00").getTime(),
          borderColor: "#000",
          label: {
            text: "Rally",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      min: new Date("25 Jan 2023 16:10").getTime(),
      tickAmount: 6,
      labels: {
        style: {
          colors: "white",
          fontFamily: "Barlow",
        },
      },
    },
    yaxis: {
      decimalsInFloat: 6,
      forceNiceScale: false,
      labels: {
        style: {
          colors: "white",
          fontFamily: "Barlow",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy hh:mm:ss",
      },
      theme: "dark",
      style: {
        fontFamily: "Barlow",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };
  return (
    <Box padding={2} bgColor={"wynd.base.sidebar"} borderRadius="lg">
      <ReactApexChart width={"100%"} options={options} series={totalHistory} type="area" height={200} />
    </Box>
  );
};
