import { useRouter } from 'next/router'

const ProposalSingle = () => {
  const router = useRouter()
  const { propId } = router.query

  return <p>Prop: {propId}</p>
}

export default ProposalSingle