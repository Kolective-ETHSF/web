import apiAgent from "@/config/api-agent.config";
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

export const useRiskProfileAI = () => {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useQuery<{ risk_profile: string }>({
    queryKey: ["risk-profile-ai"],
    queryFn: async () => {
      const response = await apiAgent.post("agent/get-risk-profile", { user_address: address })
      return response
    },
    retry: 2,
    staleTime: 120000,
    refetchInterval: 120000,
  })

  return {
    riskAI : data?.risk_profile,
    lrAI: isLoading,
    rrAI: refetch
  }
}