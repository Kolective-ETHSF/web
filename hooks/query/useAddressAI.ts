import apiAgent from "@/config/api-agent.config";
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

export const useAddressAI = () => {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useQuery<{ address: string }>({
    queryKey: ["addressAI"],
    queryFn: async () => {
      const response = await apiAgent.post("agent/get-wallet", { user_address: address })
      return response
    },
    retry: 2,
    staleTime: 30000,
    refetchInterval: 30000,
  })

  return {
    addressAI : data?.address as HexAddress,
    laAI: isLoading,
    raAI: refetch
  }
}