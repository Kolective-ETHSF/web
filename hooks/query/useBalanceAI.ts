import { normalize } from '@/lib/bignumber'
import { useBalance } from 'wagmi'
import { useAddressAI } from './useAddressAI'

export const useBalanceAI = ({ token, decimals = 18 }: { token: HexAddress, decimals: number }) => {
  const { addressAI } = useAddressAI()

  const { data: result, isLoading: bLoading, error: bError, refetch: bRefetch } = useBalance({
    address: addressAI,
    token: token as HexAddress,
  })

  const bNormal = result?.value
  const bNormalized = result?.value ? Number(normalize(result.value.toString(), decimals)) : 0

  return {
    bNormal,
    bNormalized,
    bLoading,
    bError,
    bRefetch
  }
}