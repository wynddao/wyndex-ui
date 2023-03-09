import { ENVOIRMENT } from "./constants";

interface Params {
  annualProvisions: number;
  blocksPerYear: number;
  inflation: number;
  bondedTokens: number;
  communityTax: number;
}

interface ValidatorComWithWeight {
  weight: number;
  commission: number;
}

//! TODO
const lcdApi = "https://juno-api.polkachu.com";

export const getParams = async (): Promise<Params> => {
  const { annual_provisions } = await (await fetch(lcdApi + "/cosmos/mint/v1beta1/annual_provisions")).json();
  const annualProvisions = Number(annual_provisions);

  const { params } = await (await fetch(lcdApi + "/cosmos/mint/v1beta1/params")).json();
  const blocksPerYear = Number(params.blocks_per_year);

  const { inflation } = await (await fetch(lcdApi + "/cosmos/mint/v1beta1/inflation")).json();

  const { pool } = await (await fetch(lcdApi + "/cosmos/staking/v1beta1/pool")).json();
  const bondedTokens = Number(pool.bonded_tokens);

  const { params: _params } = await (await fetch(lcdApi + "/cosmos/distribution/v1beta1/params")).json();
  const communityTax = Number(_params.community_tax);

  return {
    annualProvisions,
    blocksPerYear,
    inflation: Number(inflation),
    bondedTokens,
    communityTax,
  };
};

const calculateNominalAPR = (params: Params) => {
  return (Number(params.annualProvisions) * (1 - Number(params.communityTax))) / Number(params.bondedTokens);
};

async function getBlocksPerYearReal() {
  const { block } = await (await fetch(lcdApi + "/cosmos/base/tendermint/v1beta1/blocks/latest")).json();
  const block1 = block.header;
  const blockRange = Number(block1.height) > 10000 ? 10000 : 1;

  const { block: _block2 } = await (
    await fetch(lcdApi + "/cosmos/base/tendermint/v1beta1/blocks/" + (Number(block1.height) - blockRange))
  ).json();
  const block2 = _block2.header;

  const yearMilisec = 31536000000;
  const time1 = new Date(block1.time).getTime();
  const time2 = new Date(block2.time).getTime();
  const blockMilisec = (time1 - time2) / blockRange;

  return Math.ceil(yearMilisec / blockMilisec);
}

function calculateRealAPR(params: Params, nominalAPR: number, blocksYearReal: number) {
  const blockProvision = Number(params.annualProvisions) / Number(params.blocksPerYear);
  const realProvision = blockProvision * blocksYearReal;
  return nominalAPR * (realProvision / Number(params.annualProvisions));
}

export const getApr = async () => {
  try {
    const params = await getParams();
    const blocksYearReal = await getBlocksPerYearReal();
    const nominalAPR = calculateNominalAPR(params);
    const actualAPR = calculateRealAPR(params, nominalAPR, blocksYearReal);

    return {
      nominalAPR,
      actualAPR,
    };
  } catch (error) {
    console.log(error);
    return {
      nominalAPR: 0,
      actualAPR: 0,
    };
  }
};

export const getValidatorAvgCommission = async (validatorSet: [string, string][]) => {
  const { result: validatorList } = await (await fetch(lcdApi + "/staking/validators")).json();
  const validatorCom: ValidatorComWithWeight[] = validatorSet.map((_validator) => {
    let validator = validatorList.find((el: any) => el.operator_address === _validator[0])!;
    if (ENVOIRMENT === "dev" && !validator) {
      validator = validatorList[0];
    }
    return {
      commission: Number(validator.commission.commission_rates.rate),
      weight: Number(_validator[1]),
    };
  });
  const weightedAvg = validatorCom.reduce((prev, curr) => {
    return curr.weight * curr.commission + prev;
  }, 0);

  return weightedAvg;
};
