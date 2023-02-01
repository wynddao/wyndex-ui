import { useRecoilValue } from 'recoil'

import { WyndGaugeOrchestratorSelectors } from '../../recoil'

export const useGaugeOrchestrator = () => {
  const orchestratorAddress = process.env.NEXT_PUBLIC_GAUGE_ADDRESS as string

  const { gauges } = useRecoilValue(
    WyndGaugeOrchestratorSelectors.listGaugesSelector({
      contractAddress: orchestratorAddress,
      params: [{}],
    })
  )

  return {
    gauges,
  }
}
